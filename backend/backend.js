const API = 1

//Maria
const fs = require('fs')
const request = require('request')
const requestProgress = require('request-progress')
const process = require("process")
const AdmZip = require('adm-zip')
const uuidv4 = require('uuid/v4')

//Realtime
const appServer = require('http').createServer(() => { })
const io = require('socket.io')(appServer)


//Query
const mysql = require('mysql');

class ObsevoHandler {
    constructor() {
        this.version = "10.2.10"
    }
    run() {
        this.downloadWindow64()
    }
    downloadWindow64() {
        let archive = `archive/mariadb-${this.version}-winx64.zip`
        let url = `https://downloads.mariadb.org/f/mariadb-${this.version}/winx64-packages/mariadb-${this.version}-winx64.zip/from/http%3A//ftp.utexas.edu/mariadb/?serve`
        let path = `mariadb/`
        if (!fs.existsSync(archive)) {
            fs.mkdir("archive", () => { })
            console.log(`[Observo Database] Downloading mariadb-${this.version}-winx64.zip...`)
            this._downloadFile(url, archive, () => {
                console.log('')
                console.log(`[Observo Database] Extracting mariadb-${this.version}-winx64.zip...`)
                this._unzipFile(archive, path)
                console.log(`[Observo Database] Reaming mariadb/mariadb-${this.version}-winx64...`)
                this._rename(`${path}mariadb-${this.version}-winx64`, `${path}${this.version}`)
                this._runSQL()
            })
        } else {
            this._runSQL()
        }
    }
    onMariaFinishBoot(callback) {
        this.callback = callback
    }
    /******************************************************/
    _downloadFile(url, path, callback) {
        function print(progress) {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            process.stdout.write(progress)
        }
        requestProgress(request(url), {})
            .on('progress', function (state) {
                // The state is an object that looks like this: 
                // { 
                //     percent: 0.5,               // Overall percent (between 0 to 1) 
                //     speed: 554732,              // The download speed in bytes/sec 
                //     size: { 
                //         total: 90044871,        // The total payload size in bytes 
                //         transferred: 27610959   // The transferred payload size in bytes 
                //     }, 
                //     time: { 
                //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals) 
                //         remaining: 81.403       // The remaining seconds to finish (3 decimals) 
                //     } 
                // } 
                print(`[Observo Database] Downloaded ${Math.floor(state.percent * 100)}% - Elasped Time: ${Math.floor(state.time.elapsed)} seconds...`)
            })
            .on('error', function (err) {
                // Do something with err 
            })
            .on('end', function () {
                callback.call()
            })
            .pipe(fs.createWriteStream(path))
    }
    _unzipFile(archive, path) {
        var zip = new AdmZip(archive)
        zip.extractAllTo(path)
    }
    _rename(from, to) {
        fs.rename(from, to, function (err) {
            if (err) console.log('ERROR: ' + err)
        })
    }
    _runSQL() {
        console.log(`[Observo Database] Booting MariaDB`)
        let cmd = `cd mariadb/${this.version}/bin/ && mysqld --console`
        const exec = require('child_process').exec
        let code = exec(cmd)
        if (this.callback != undefined) {
            this.callback.call()
        }
    }
}

/* The realtime socket (Socket.io) */
class RealTimeHandler {
    constructor() {
        let me = this
        let prefix = `[Observo Realtime]`
        console.log(`${prefix} Booting Socket.io`)

        appServer.listen(1234)

        let auth = io.of('/authenticate').on('connection', function (socket) {
            let id = uuidv4() //Get a UUID
            let clientPrefix = `${prefix} [${id}]` //Make the console prefix
            console.log(`${clientPrefix} Client Connected`)
            socket.on("handshake", function (data) {
                console.log(`${clientPrefix} API Version : ${data.api}`)
                if (data.api < API) {
                    socket.emit("close", { "reason": "Client API is too new!" })
                    socket.disconnect()
                }
                if (data.session != undefined) {
                    console.log("Session: " + data.authKey)
                } else {
                    socket.emit("verified", { invaild: true })
                }
            })
            socket.on("authenticate", function (data) {
                console.log(data.username)
                let username = data.username
                _DataCore.isUser(data.username, (check) => {
                    if (!check) {
                        socket.emit("account", { state: "new", username: username })
                    } else {
                      //log user in  
                    }
                })
            })
            socket.on("end", function (data) {
                console.log(`${clientPrefix} Client has disconnected`)
                socket.disconnect()
            })
        })
    }
}

//Manages the SQL System (for creating database and connecting)
class DatabaseManagement {
    constructor() {
        this.con = this.connect()
        console.log("[Observo Query] Connected to MariaDB");
    }
    connect(database = null) {
        let data //Makes the variable here
        if (database != null) { //If no database is specified, it connects a default
            data = {
                host: "localhost",
                user: "root",
                password: "",
                database: database
            }
        } else {
            data = {
                host: "localhost",
                user: "root",
                password: ""
            }
        }
        //Make the connection
        var con = mysql.createConnection(data);
        //Connect
        con.connect(function (err) {
            if (err) throw err; //If error occurs, it with throw it
        });
        return con //Return that connection to whatever is calling it
    }
    /**
     * createDB
     * @param {*name} database 
     * @param {*Function} callback 
     */
    createDB(database, callback) {
        this.con.query(`CREATE DATABASE IF NOT EXISTS ${database}`, function (err, result) {
            if (err) throw err;   
                callback.call() 
        });
    }
}
/*
DataHandler
- Handles all the Observo Data (users, settings, etc) 
*/
class DataCore {
    constructor() {
        this.create()
        console.log("[Observo Mangement] Loading Database...");
    }
    //Create the database (if haven't yet)
    create() {
        //Call DatabaseManagement handler, and create a new database, it requires a callback
        _DatabaseManagement.createDB("data", () => {
            //When the callback trigger, connect using the DatabaseManagement connect method
            this.sql = _DatabaseManagement.connect("data")
            //After gettings the conenct for the database DATA (by usign this.sql), lets make the USERS table
            var sql = "CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT,`uuid` varchar(100) NOT NULL,`sessionKey` varchar(100) NOT NULL,`authKey` varchar(100) NOT NULL,`username` varchar(100) NOT NULL,`password` varchar(100) NOT NULL,`role` int(11) NOT NULL,`permissions` text NOT NULL,`avatar` blob NOT NULL,`color` varchar(6) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1";
            //Lets query the SQL for the USERS table above
            this.sql.query(sql, function (err, result) {
                if (err) throw err;
            });
        })
    }
    isUser(username, callback) {
        this.sql.query(`SELECT * FROM users WHERE (username="${username}")`, function (err, results, fields) {
          if (err) throw err;
          if (results.length > 0) {
            callback(true)
          } else {
            callback(false)
          }
        });
      
    }
    addUser(username, password) {

    } 
    removeUser(uuid) {

    }
}

/* BACKEND.JS - MAIN */

//Define Global (changable variables)
let _DatabaseManagement, _DataCore, _RealTime

//Create the constant ObsevoHandler (for downloading and running the database, and various other methods)
const Observo = new ObsevoHandler()
//When the database is finished booting, trigger a callback
Observo.onMariaFinishBoot(()=>{
    //Using are already pre-defined variables, we can init all other classes here
    _DatabaseManagement = new DatabaseManagement()
    _DataCore = new DataCore()
    _RealTime = new RealTimeHandler()    
})
//After all, we have to start observo somewhere.
Observo.run() 
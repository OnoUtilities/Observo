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



class MariaHandler {
    constructor() {
        this.version = "10.2.10"
    }
    downloadWindow64() {
        let archive = `archive/mariadb-${this.version}-winx64.zip`
        let url = `https://downloads.mariadb.org/f/mariadb-${this.version}/winx64-packages/mariadb-${this.version}-winx64.zip/from/http%3A//ftp.utexas.edu/mariadb/?serve`
        let path = `mariadb/`
        if (!fs.existsSync(archive)) {
            fs.mkdir("archive", () => {})
            console.log(`[Observo Database] Downloading mariadb-${this.version}-winx64.zip...`)
            this.downloadFile(url, archive, () => {
                console.log('')
                console.log(`[Observo Database] Extracting mariadb-${this.version}-winx64.zip...`)
                this.unzipFile(archive, path)
                console.log(`[Observo Database] Reaming mariadb/mariadb-${this.version}-winx64...`)
                this.rename(`${path}mariadb-${this.version}-winx64`, `${path}${this.version}`)
                this.runSQL()
            })
        } else {
            this.runSQL()
        }
    }
    downloadFile(url, path, callback) {
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
                print(`[Observo Database] Downloaded ${Math.floor(state.percent * 100)}% - Elasped Time: ${Math.floor(state.time.elapsed)}`)
            })
            .on('error', function (err) {
                // Do something with err 
            })
            .on('end', function () {
                callback.call()
            })
            .pipe(fs.createWriteStream(path))
    }
    unzipFile(archive, path) {
        var zip = new AdmZip(archive)
        zip.extractAllTo(path)
    }
    rename(from, to) {
        fs.rename(from, to, function(err) {
            if ( err ) console.log('ERROR: ' + err)
        })
    }
    runSQL() {
        console.log(`[Observo Database] Booting MariaDB`)
        let cmd = `cd mariadb/${this.version}/bin/ && mysqld --console`
        const exec = require('child_process').exec
        let code = exec(cmd)
    }
}

class RealtimeHandler {
    constructor() {
        let me = this
        let prefix = `[Observo Realtime]`
        console.log(`${prefix} Booting Socket.io`)

        appServer.listen(80)

        let auth = io.of('/authenticate').on('connection', function (socket) {
            let id = uuidv4()
            let clientPrefix = `${prefix} [${id}]`
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
                console.log(data)
            })
            socket.on("end", function (data) {
               console.log(`${clientPrefix} Client has disconnected`)
               socket.disconnect()
            })
        })
    }  
}

const maria = new MariaHandler().downloadWindow64()
const rt = new RealtimeHandler()
class AUTHETICATE {
    constructor() {
    }
    run(ip) {
        let me = this
        me.connecting = true
        //Hide the main content screen (which shows the loading box)
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").show()

        //Attempt to connect to server
        let auth = io.connect(`${ip}authenticate`)

        //If server won't connect this event is thrown
        auth.on('connect_error', function () {
            //Show the loader error screen
            forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showError("Couldn't Connect!")
            //Close the client
            auth.close()
            //Wait 1.5 seconds until the error screen shows and reset the loader
            setTimeout(() => {
                forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showConnecting()
                forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
                //Not connecting anymore
                me.connecting = false;
            }, 1500)

        })
        //If the client can connect run this event
        auth.on('connect', function () {
            /* JSON 
 
              api: API - passes API (from explorer.html) to server
              *authKey: <server authkey>* - a auth keep if remember me is enabled, regenerated each time on signin
 
            */
            auth.emit("handshake", { api: API })  //Emit API (and optional authKey) via the handshake EVENT to the server

            //On close event, used if API is out of date or other CLOSING needs
            auth.on("close", (data) => {
                alert(data)
            })
            //Used my authetication key is good or
            //This opens the connect box from MAIN palette in Box called contents. Then it used the local instance of class to run a method call open()
            let connect = forklift.App.getPaletteInstance("DIALOGS").connect
            auth.on("verified", (data) => {
                if (data.invaild == true) {
                    //Invaild session key tell client to open USER CONNECT BOX and show LOADING Stepper
                    connect.open(() => {
                        //When the box opens, use the callback to run further code
                        connect.onConnect(() => {
                            //When the connect button is pressed, send username and password
                            console.log(connect.getUsername())
                            console.log(connect.getPassword())
                            auth.emit("authenticate", { username: connect.getUsername(), password: connect.getPassword() })
                        })
                        connect.onCancel(() => {
                            //When the cancel button is pressed, close the box and send disconnect
                            forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
                            connect.close()
                            auth.emit("end", [""])
                            me.connecting = false
                        })
                    })
                } else {
                    
                }
            })
            auth.on("account", (data) => {
                //data.username
                
                if (data.state == "new") {
                    connect.hide()
                    connect.confirm.display("New account?", `Do you want to create '${data.username}' as a new account?`, (data) => {
                        console.log(data)
                        if (data) {
                            auth.emit("create", { username: connect.getUsername(), password: connect.getPassword() })
                        }
                        connect.show()
                    })
                }
                if (data.state == "success") {
                    connect.close()
                    //forklift.App.getPaletteInstance("GRID-SERVERS").getBoxObject("SERVERS").connect(ip, data.sessionKey)
                    forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showConnecting()
                    forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
                    forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1,-3, 0)
                }
            })
        })
    }
}
class CONNECTION {
    constructor() {
    
    }
    connect(uuid, sessionID) {
        let auth = io.connect(`${ip}`)
    }
  
}




const Runtime = {}
Runtime.AUTHETICATE = new AUTHETICATE()


module.exports = Runtime
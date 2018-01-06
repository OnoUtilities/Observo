import "OBSERVO.SOCKET.CHANNEL"

export class Autheticate extends OBservo.Socket.Channel {
    constructor() {
        super()
    }
    //ip, authKey
    run(ip, uuid = null, authKey = null) {
        this.connect = forklift.App.getPaletteInstance("DIALOGS").connect
        this.open = false
        this.open = true

        this.dialogCanceled = false
        this.dialogOpened = false

        this.authKey = authKey
        this.uuid = uuid

        this.connecting = true
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").show()
        this.useChannel(ip, "authenticate")
    }
    onConnect(socket) {
        let me = this
        me.connecting = true
        socket.on("vaild_api", function (data) {
            if (me.authKey != null && me.uuid != null) {
                //use auth key
            } else {
                me.openConnect(socket)
            }
        })
        socket.on("invaild_authKey", function (data) {
            me.openConnect(socket)
        })
        socket.on("vaild_signUp",  function (data) {
            me.connect.hide()
            forklift.App.getPaletteInstance("DIALOGS").connect.confirm.display("New account?", `Do you want to create '${data.username}' as a new account?`, (state) => {
                if (state) {
                    socket.emit("check_signUp", { username: me.connect.getUsername(), password: me.connect.getPassword() })
                }
                me.connect.show()
            })
        })
        socket.on("vaild_signIn",  function (data) {
            me.vaildSignIn(socket, data)
        })
        socket.emit("check_api", { api: API })  //Emit API (and optional authKey) via the handshake EVENT to the server


    }
    vaildSignUp(socket, data) {
        let me = this
        this.connect.hide()
        this.connect.confirm.display("New account?", `Do you want to create '${data.username}' as a new account?`, (data) => {
            console.log(data)
            if (data) {
                socket.emit("check_signUp", { username: me.connect.getUsername(), password: me.connect.getPassword() })
            }
            me.connect.show()
        })
    }
    vaildSignIn(socket, data) {
        console.log("VAILD")
        //SAVE AUTH KEY (data.authKey IF) user.session is saved
        this.connect.close()
  
        //let home = use("RUNTIME.EXPLORER.HOME")["CORE"].run(this.ip)
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showConnecting()
        //let user = use("RUNTIME.EXPLORER")["USER"].run(this.ip, data.uuid, data.sessionKey)
        let project = use("RUNTIME.EXPLORER")["PROJECT"].run(this.ip, data.uuid, data.sessionKey)
        this.dialogCanceled = true
        socket.close()
        
    }
    openConnect(socket) {
        let connect = this.connect
        let me = this
        connect.open(() => {
            me.dialogOpened = true
            //When the box opens, use the callback to run further code
            connect.onConnect(() => {
                //When the connect button is pressed, send username and password
                console.log("CHECKIGN SIGNIn")
                socket.emit("check_signIn", { username: connect.getUsername(), password: connect.getPassword() })
                
            })
            connect.onCancel(() => {
                //When the cancel button is pressed, close the box and send disconnect
                forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
                connect.close()
                socket.close()

                me.dialogOpened = false
                me.dialogCanceled = true
                me.connecting = false
            })
        })
    }
    onDisconnect(socket, text = "Server has closed the connection!") {
        if (!this.dialogCanceled) {
            this.open = false
            this.showError(socket, "Server has closed the connection!")
       }
    }
    onError(socket) {
        this.open = false
        this.showError(socket, "Failed to connect to server!")
    }
    showError(socket, text) {
        let me = this
        if (this.dialogOpened == true) {
            this.connect.close()
        }
        //Show the loader error screen
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showError(text)
        //Close the client
        socket.close()
        //Wait 1.5 seconds until the error screen shows and reset the loader
        setTimeout(() => {
            if (!me.open) {
                forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showConnecting()
                forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
                //Not connecting anymore
                me.connecting = false; 
            }
        
        }, 1500)
    }
}
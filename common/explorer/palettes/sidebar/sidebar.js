class Sidebar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
    }
    onContentLoad() {
        let me = this
        let servers = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").storage.getServers()
        for (var key in servers) {
            if (servers.hasOwnProperty(key)) {
                let server = servers[key]

                this.element.querySelector("div").insertAdjacentHTML('beforeend', ` <x-box vertical class="box"></x-box>`)
                let boxes = this.element.querySelectorAll("x-box")
                let box = boxes[boxes.length - 1]

                box.insertAdjacentHTML('beforeend', `<x-label class="title"></x-label>`)
                let labels = this.element.querySelectorAll("x-label")
                let title = labels[labels.length - 1]
                title.innerHTML = title.innerHTML = server.name

                box.insertAdjacentHTML('beforeend', `<x-label class="text"><span class="bold">Address: </span></x-label>`)
                labels = this.element.querySelectorAll("x-label")
                let location = labels[labels.length - 1]
                location.innerHTML = location.innerHTML + server.ip

                box.addEventListener("click", function () {
                    if (!me.connecting) {
                        me.connecting = true
                        me.autheticate(server.ip)
                    }
                })
            }
        }
    }
    autheticate(ip) {
        //Developement TAG
        if (ip == "DEV:EXPLORER") {
            this.connect(ip)
        } else {
            let me = this

            //Hide the main content screen (which shows the loading box)
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").hide()

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
                    forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").show()
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
                                let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
                                content.style.display = ""
                                connect.close()
                                auth.emit("end", [""])
                                me.connecting = false
                            })
                        })
                    } else {
                        //pass login to server with data.sessionKey
                    }
                })
                auth.on("account", (data) => {
                    //data.username
                    if (data.state == "new") {
                        connect.close()
                        prompt.show("Do you want to create this new account?", (data) => {
                            console.log(data)
                            if (data == null) {
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
                                        let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
                                        content.style.display = ""
                                        connect.close()
                                        auth.emit("end", [""])
                                        me.connecting = false
                                    })
                                })
                            } else if (data) {
                                auth.emit("createAccount", { username: connect.getUsername(), password: connect.getPassword()}) 
                            } else if (!data) {
                                let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
                                content.style.display = ""
                                connect.close()
                                auth.emit("end", [""])
                                me.connecting = false
                            }
                        })
                    }
                })
            })
        }

    }
    //Open the window to the server
    //TODO: Add another paramter for sessionKey
    connect(ip) {
        let mainWin = managerRemote.createWindow({
            show: false,
            width: 1000,
            height: 800,
            frame: false,
            color: "#000",
            webPreferences: {
                zoomFactor: 0.9,
            },
            icon: path.join(managerRemote.getDir(), 'assets/icons/png/1024x1024.png')
        })
        mainWin.setURL(managerRemote.getDir(), "project.html", { server_ip: ip })
        mainWin.win.setMinimumSize(800, 700);
        mainWin.win.webContents.on('did-finish-load', () => {
            mainWin.win.show()
            win.close();
        })
        let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
        content.style.display = "none"
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SIDEBAR", "o-sidebar", Sidebar)
    }
}
module.exports = Palette
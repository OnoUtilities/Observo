class Sidebar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
    }
    onContentLoad() {
        let me = this
        let servers = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").storage.getServers() //serverList
        let x = 1;

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

                box.addEventListener("contextmenu", function () {
                    let serverName = server.name

                    contextMenu.openTemp((self, items) => {
                        let remove = self.addItemAbove("<remove>")
                        remove.setTitle(`Remove ${serverName}`)
                        remove.setIcon("delete")
                        remove.onClick(() => {
                            console.log(server.name)
                        })
                        let edit = self.addItemBelow("<edit>")
                        edit.setTitle("Edit")
                        edit.setIcon("create")
                        edit.onClick(() => {
                                forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveDown()
                            })
                        })
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
                        //pass login to server with data.sessionKey
                    }
                })
                auth.on("account", (data) => {
                    //data.username
                    if (data.state == "new") {
                        connect.hide()
                        connect.confirm.display("New account?", `Do you want to create '${data.username}' as a new account?`, (data) => {
                            console.log(data)
                            if (data) {
                                auth.emit("createAccount", { username: connect.getUsername(), password: connect.getPassword()}) 
                            }
                            connect.show()
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
/*class SidebarHandler {
    constructor(id) { }
    onUnitLoad() {
        let me = this
        this.serverProjects = new ServerProjectsHandler(me)
    }
}
class ServerProjects extends forklift.PaletteBox {
    constructor(id) {
        super(id)
        this.loadBox("elements/o-projects/projects.shadow.html")
        this.loadContent("elements/o-projects/projects.html")
    }
}

class ServerProjectsHandler {
    constructor(id) {
        let projectsDrawer = new xel.Drawer()
        projectsDrawer.drawer.innerHTML = '<o-projects></o-projects>'
        this.projectButton = new xel.MenuItem("#projects")
        this.projectButton.onClick(() => {
            this.projectsDrawer.open()
        })
    }
}*/
/*<x-box>
<x-button id="projects">TEST</x-button>
</x-box>*/
//put in sidebar.html o add the test button
//Bruce needs to fix this 
/*
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SIDEBAR", "o-sidebar", Sidebar)
      //  this.addBox("PROJECTS", "o-projects", ServerProjects)
    }
}
module.exports = Palette

*/
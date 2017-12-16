class Servers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-servers/grid-servers.shadow.html")
        this.loadContent("elements/o-grid-servers/grid-servers.html")
    }
    onUnitLoad() {
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveRight()
        })
        this.addServer = this.element.querySelector("#addServer")
        this.addServer.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveDown()
        })

        this.sidebar = this.element.querySelector("o-sidebar").object
    }
    //Open the window to the server
    //TODO: Add another paramter for sessionKey
    connect(ip, sessionKey) {
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
        mainWin.setURL(managerRemote.getDir(), "project.html", { serverIP: ip, sessionKey: sessionKey})
        mainWin.win.setMinimumSize(800, 700);
        mainWin.win.webContents.on('did-finish-load', () => {
            mainWin.win.show()
            win.close();
        })
        let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
        content.style.display = "none"
    }
}


class AddServers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-add-server/grid-add-server.shadow.html")
        this.loadContent("elements/o-grid-add-server/grid-add-server.html")
    }
    onUnitLoad() {
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        // Code for confirm button 
        this.confirm = this.element.querySelector('#confirm')
        this.confirm.addEventListener("click", () => {
            this.addServer()
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        this.updateSidebar()
    }
    addServer() {
        forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config

        let replaceAll = function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        let serverTitle = this.element.querySelector('#server-name').value // Variable for the text in the server name input box
        let ipAddress = this.element.querySelector('#ip-address').value  // Variable for the text in the ip address input box
        let id = serverTitle.toLowerCase()
        id = replaceAll(id, " ", "_")
        fl.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.addServer(id, serverTitle, ipAddress)
        this.updateSidebar()
        
    }
    updateSidebar() {
        console.log("sss")
        let sidebar = fl.App.getPaletteInstance("GRID-SERVERS").getBoxObject("SERVERS").sidebar
        let servers = fl.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.getServers()
        console.log(sidebar.element)
        sidebar.element.querySelector("div").innerHTML = ""
        for (let server in servers) {
            let value = servers[server] //server is the id of the array
            sidebar.addItem(server, value.name, {
                "Address": value.ip
            })
            sidebar.addClick(server, () => {
                Runtime.AUTHETICATE.run(value.ip)
            })
            sidebar.addContext(server, () => {
                contextMenu.openTemp((self, items) => {
                    let edit = self.addItemBelow("Edit")
                    edit.setTitle("Edit")
                    edit.onClick(() => {
                        console.log("RAWR")
                    })
                })
            })
        }
    }
}
class Projects extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-grid-project-server/grid-project-server.shadow.html")
        this.loadContent("elements/o-grid-project-server/grid-project-server.html")
    }
    onUnitLoad() {
        
    }
}
// Work on the input boxes for "add server" 
// Make rename and IP in the input boxes
// When "edit" is clicked, "ADD SERVER" changes to "SERVER SETTINGS"
// Maybe make notifications?
// Maybe change the "ADD SERVER" on the add server slide to "SERVER SETTINGS" 
// Attempt to make the servers removeable
// Once servers are finished, move over to the projects 
// (Hopefully be able to copy with minimal changes)

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SERVERS", "o-grid-servers", Servers)
        this.addBox("ADDSERVER", "o-grid-add-server", AddServers)
        this.addBox("PROJECTS", "o-grid-project-server", Projects)
    }
}

module.exports = Palette
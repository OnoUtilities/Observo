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

        let se = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").storage.getServers() //serverList
        let sidebar = this.element.querySelector("o-sidebar").object;

        sidebar.addItem("DEV", "Developement", {
            "Version": "0.1"
        })
        sidebar.addClick("DEV", () => {
            this.connect("")
        })  
        sidebar.addContext("DEV", ()=> {
            
        })      
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


class AddServers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-add-server/grid-add-server.shadow.html")
        this.loadContent("elements/o-grid-add-server/grid-add-server.html")
    }
    onUnitLoad() {
        let sidebar= this.element.querySelector("o-sidebar").object; 
        let serverName = document.getElementById('server-name').value // Variable for the text in the server name input box
        //getElementById stores the text in the input box in a variable
        let ipAddress = document.getElementById('ip-address').value  // Variable for the text in the ip address input box
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        // Code for confirm button 
        this.test = this.element.querySelector('#confirm')
        this.test.addEventListener("click", () => {
            console.log("The server name is " + document.getElementById('server-name').value)
            console.log("The ip is " + document.getElementById('ip-address').value)  
           sidebar.addItem(serverName, ipAddress, {"Version": "0.1"})
           sidebar.addClick(serverName, () => {
               this.connect("")
           })
           sidebar.addContext(serverName, () => {
               
           })
        })
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
    }
}

module.exports = Palette
class Servers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-servers/grid-servers.shadow.html")
        this.loadContent("elements/o-grid-servers/grid-servers.html")
    }
    onUnitLoad() {
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveRight()
        })
        this.addServer = this.element.querySelector("#addServer")
        this.addServer.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveDown()
        })
    }
}


class AddServers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-add-server/grid-add-server.shadow.html")
        this.loadContent("elements/o-grid-add-server/grid-add-server.html")
    }
    onUnitLoad() {
        let serverName = document.getElementById('server-name').value // Variable for the text in the server name input box
        //getElementById stores the text in the input box in a variable
        let ipAddress = document.getElementById('ip-address').value  // Variable for the text in the ip address input box
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveUp()
        })
        // Code for confirm button 
        this.test = this.element.querySelector('#confirm')
        this.test.addEventListener("click", () => {
            console.log("The server name is " + serverName)
            console.log("The ip is " + ipAddress)  
           forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveUp()
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
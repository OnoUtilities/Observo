class Connect extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-connect/connect.shadow.html")
        this.loadContent("elements/o-connect/connect.html")
    }
}

class ConnectHandler {
    constructor() { }
    open(func) {
        this.connectDialog = new xel.Dialog()
        this.connectDialog.dialog.innerHTML = '<o-connect></o-connect>'
        this.connectDialog.dialog.style.borderRadius = "25px"
        this.connectDialog.dialog.style.width = "400px"
        this.connectDialog.disableOverlayClose()

        setTimeout(() => {

            console.log(this.connectDialog.dialog.querySelector("#connect"))
            this.connectBtn = this.connectDialog.dialog.querySelector("#connect")
            this.cancelBtn = this.connectDialog.dialog.querySelector("#cancel")
            this.connectDialog.open()
            func.call()
        }, 100)
    }
    close() {
        this.connectDialog.close()
    }
    onUnitLoad() {
        let me = this
        this.newProject = new NewProjectHandler(me)
        this.addServer = new AddServerHandler(me)
        this.aboutOpen = new AboutHandler(me)
    }
    onConnect(func) {
        this.connectBtn.addEventListener("click", () => {
            func.call()
        })
    }
    onCancel(func) {
        this.cancelBtn.addEventListener("click", () => {
            func.call()
        })
        this.connectDialog.onEscape(() => {
            func.call()
        })
    }
    getUsername() {
        return this.connectDialog.dialog.querySelector("#username").value
    }
    getPassword() {
        return this.connectDialog.dialog.querySelector("#password").value
    }
}


class NewProject extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-newproject/newproject.shadow.html")
        this.loadContent("elements/o-newproject/newproject.html")
    }
}

class NewProjectHandler {
    constructor() {
        let newProject = new xel.Prompt()
        newProject.drawer.innerHTML = '<o-newproject></o-newproject>'
        this.projectButton = new xel.MenuItem("#open-project")
        this.projectButton.onClick(() => {
            newProject.open()
        })

    }
}

class AddServer extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-server/server.shadow.html")
        this.loadContent("elements/o-server/server.html")
    }
}

class AddServerHandler {
    constructor() {
        let addServerMenu = new xel.Prompt()
        addServerMenu.drawer.innerHTML = '<o-server></o-server>'
        this.addServer = new xel.MenuItem("#new-project")
        this.addServer.onClick(() => {
            addServerMenu.open()
            let p = new xel.Prompt()
            p.drawer.innerHTML = '<o-newserver></o-newserver>'
            this.newServerButton = new xel.MenuItem("#create-server")
            this.newServerButton.onClick(() => {
                p.open()
            })
        })
    }
}

class NewServer extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-newserver/newserver.shadow.html")
        this.loadContent("elements/o-newserver/newserver.html")
    }
}

class About extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-about/about.shadow.html")
        this.loadContent("elements/o-about/about.html")
    }
}

class AboutHandler {
    constructor() {
        let aboutMenu = new xel.Prompt()
        aboutMenu.drawer.innerHTML = '<o-about></o-about>'
        this.about = new xel.MenuItem("#about")
        this.about.onClick(() => {
            aboutMenu.open()
        })
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("CONNECT", "o-connect", Connect)
        this.addBox("NEWPROJECT", "o-newproject", NewProject)
        this.addBox("NEWSERVER", "o-newserver", NewServer)
        this.addBox("SERVER", "o-server", AddServer)
        this.addBox("ABOUT", "o-about", About)
    }
    onUnitLoad() {
        this.newProject = new NewProjectHandler()
        this.addServer = new AddServerHandler()
        this.aboutOpen = new AboutHandler()
        this.connect = new ConnectHandler()
    }
}

module.exports = Palette
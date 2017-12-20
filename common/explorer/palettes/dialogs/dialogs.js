class Connect extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-connect/connect.html")
    }
}

class Confirm extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-confirm/confirm.html")
    }
    yes() {}
    no() {}
    onContentLoad() {
        this.hide()
        let me = this
        this.yesBtn = this.element.querySelector("#yes").addEventListener("click", () => {
            console.log("yes")
            me.yes()
        })
        this.noBtn = this.element.querySelector("#no").addEventListener("click", () => {
            me.no()
        })
        this.title = this.element.querySelector("#title")
        this.message = this.element.querySelector("#message")
    }
    display(title, message, callback) {
        let me = this

        this.show()

        this.title.innerHTML = title
        this.message.innerHTML = message
        me.yes = () => {
            me.hide()
            callback(true)
        }
        me.no = () => {
            me.hide()
            callback(false)
        }
    }
    show() {
        this.element.style.display = ""
    }
    hide() {
        this.element.style.display = "none"
    }
}

class ConnectHandler {
    constructor() {}
    open(func) {
        this.connectDialog = new xel.Dialog()
        this.connectDialog.dialog.innerHTML = '<o-connect></o-connect>'
        this.connectDialog.dialog.style.borderRadius = "25px"
        this.connectDialog.dialog.style.width = "400px"
        this.connectDialog.disableOverlayClose()

        setTimeout(() => {

            this.sigin = this.connectDialog.dialog.querySelector("#sigin")
            this.confirm = this.connectDialog.dialog.querySelector("o-confirm").object
            this.connectBtn = this.connectDialog.dialog.querySelector("#connect")
            this.cancelBtn = this.connectDialog.dialog.querySelector("#cancel")

            this.username = new xel.Input(this.connectDialog.dialog.querySelector("#username"))
            this.password = new xel.Input(this.connectDialog.dialog.querySelector("#password"))
            this.connectDialog.open()
            func.call()
        }, 100)
    }
    close() {
        this.connectDialog.close()
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
    //**//
    show() {
        this.sigin.style.display = ""
    }
    hide() {
        this.sigin.style.display = "none"
    }
}


class NewProject extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
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
        this.ipAddress = new xel.DialogInput("#server-ip")
    }
}

class AddServer extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
        this.loadContent("elements/o-server/server.html")
    }
}

class AddServerHandler {
    constructor(e) {
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
                this.newServer = new xel.MenuItem("#add-new-server")
                this.newServer.onClick(() => {
                    let addNewServer = forklift.App.getPaletteInstance("SIDEBAR").connect
                })
            })
        })
    }
}

class NewServer extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
        this.loadContent("elements/o-newserver/newserver.html")
    }
}

class About extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
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

class Settings extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
        this.loadContent("elements/o-settings/userSettings.html")
    }
    onContentLoad() {
        this.avatarInput = this.element.querySelector("#avatarInput")
        this.submitButton = new xel.Button(this.element.querySelector("#submitAvatar"))
        this.submitButton.onClick(() => {
            console.log(this.fileToB64(this.avatarInput.files[0].path, true))
        })
    }
    /**
     * Converts an inputed file into base64 with the option to convert it into a dataURL for img tags
     * @param {String} file Path (can be relative or absolute) to image file [WILL BE UPDATE FOR ADDITIONAL INPUT]
     * @param {Boolean} returnDataURL Return a format usable in the "src" attribute for the image tag
     */
    fileToB64(file, returnDataURL) {
        let fileContents = require("fs-jetpack").read(file, "buffer") //Import an image as binary buffer
        let arr = new Uint8Array(fileContents); //Get an integer array based on the buffer
        let raw = String.fromCharCode.apply(null, arr); //Passes the array to the string converter (Normally would have to be a for loop, but "apply" circumvents that)
        let b64 = btoa(raw); //Encodes a string into base64. Use "atob(b64);" for proof
        if (returnDataURL) { //If the caller would like just the base64, they specify otherwise
            return "data:image/jpeg;base64," + b64; //Put into a readable format for the "src" attribute
        }
        return b64.toString() //Make sure that b64 is a String and return
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
        this.addBox("CONFIRM", "o-confirm", Confirm)
        this.addBox("SETTINGS", "o-settings", Settings)
    }
    onUnitLoad() {
        //this.newProject = new NewProjectHandler()
        //this.addServer = new AddServerHandler()
        //this.aboutOpen = new AboutHandler()
        this.connect = new ConnectHandler()
    }
}

module.exports = Palette
const jetpack = require('fs-jetpack')
const path = require('path')

class Menubar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-menubar/menubar.shadow.html")
        this.loadContent("elements/o-menubar/menubar.html")
    }
    onContentLoad() {
        console.log("ADDED MENUBAR")
        this.title_menubar = new xel.TitleMenubar(windowID, "#menubar")
        this.title_menubar.addClose()
        this.title_menubar.addMinimize()
        this.title_menubar.build()
    }
}
class StorageSystem { //TODO put into global-type file
    constructor(parent) {
        this.parent = parent

        this.loaded = false
        this.file = ""

        const cwd = process.cwd()
        const portableHome = path.join(cwd, 'portable')
        if (require('fs').existsSync(portableHome)) {
            process.env.OBSERVO_HOME = portableHome
        }
        const home = process.env.OBSERVO_HOME || require('os').homedir()
        this.home = home

        this.presets = path.join(home, '.observo/presets/')

        this.profilePath = path.join(home, '.observo/config.json')
        this.serverList = path.join(home, '.observo/serverList.json') //serverList


        if (!jetpack.exists(this.profilePath)) {
            const template_c = require('./templates/config.json')
            jetpack.write(this.profilePath, template_c)
        }
        try {
            const config = require(this.profilePath)
            this.config = config;
        } catch (e) {
            this.config = null
        }

        if (!jetpack.exists(this.serverList)) {
            const template_r = require('./templates/serverList.json')
            jetpack.write(this.serverList, template_r)
        }
        try {
            const servers = require(this.serverList)
            this.servers = servers
        } catch (e) {
            this.servers = null
        }

        this.data = {}
    }
    getServers() {
        return this.servers
    }
    loadTemplate(file) {
        try {
            const data = require(file)
            console.log(data)
            return data
        } catch (e) {
            console.log(e)
            return null
        }
    }
    getStorageCell(id) {
        if (this.data[id] != undefined) {
            return this.data[id]
        }
    }
    saveStorageCell(id, data) {
        this.data[id] = data
    }
    isCell(id) {
        if (this.data[id] != undefined) {
            return true
        }
        return false
    }
    /**
     * Converts an inputted file into base64 with the option to convert it into a dataURL for img tags
     * @param {String} file 
     * @param {Boolean} returnDataURL 
     */
    fileToB64(file, returnDataURL) {
        let fileContents = require("fs-jetpack").read("./assets/images/corgi.png", "buffer") //import an image as binary buffer
        let arr = new Uint8Array(fileContents); //Get an integer array based on the buffer
        let raw = String.fromCharCode.apply(null, arr); //Passes the array to the string converter (Normally would have to be a for loop, but "apply" circumvents that)
        let b64 = btoa(raw); //Encodes a string into base64. Use "atob(b64);" for proof
        if (returnDataURL) { //If the caller would like just the base64, they specify otherwise
            return "data:image/jpeg;base64," + b64; //Put into a readable format for the "src" attribute
        }
        return b64.toString() //Make sure that b64 is a String and return
    }
}

class Box extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-box/box.shadow.html")
        this.loadContent()
    }
}

//let sidebar = forklift.App.getPaletteInstance("SIDEBAR").getBoxObject("SIDEBAR")
//Fix this - Bruce
class Content extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-content/content.shadow.html")
        this.loadContent("elements/o-content/content.html")
        this.storage = new StorageSystem(this)
        this.posX = 0
        this.posY = 0
    }
    removeXClasses()  {
        this.element.classList.remove("center-to-left");
        this.element.classList.remove("left-to-center");
        this.element.classList.remove("center-to-right");
        this.element.classList.remove("right-to-center");
    }
    removeYClasses() {
        this.element.classList.remove("center-to-bottom");
        this.element.classList.remove("bottom-to-center");
        this.element.classList.remove("center-to-top");
        this.element.classList.remove("top-to-center");
    }
    removeAllClasses() {
        this.removeYClasses()
        this.removeXClasses()
    }
    moveLeft() {
        if (this.posX == 0) {
            this.removeAllClasses()
            this.element.classList.add("center-to-left");
            this.posX = -1
        }
        if (this.posX == 1) {
            this.removeAllClasses()
            this.element.classList.add("right-to-center");
            this.posX = 0
        }
    }
    moveRight() {
        if (this.posX == 0) {
            this.removeAllClasses()
            this.element.classList.add("center-to-right");
            this.posX = 1
        }
        if (this.posX == -1) {
            this.removeAllClasses()
            this.element.classList.add("left-to-center");
            this.posX = 0
        }
        console.log(this.posX)
    }

    moveUp() {
        if (this.posY == 0) {
            this.removeYClasses()
            this.element.classList.add("center-to-top");
            this.posY = 1
        }
        if (this.posY == -1) {
            this.removeYClasses()
            this.element.classList.add("bottom-to-center");
            this.posY = 0
        }
        console.log(this.posY)
    }
    moveDown() {
        if (this.posY == 1) {
            this.removeYClasses()
            this.element.classList.add("top-to-center");
            this.posY = 0
        }
        if (this.posY == 0) {
            this.removeYClasses()
            this.element.classList.add("center-to-bottom");
            this.posY = -1
        }
        
    }
    
    hide() {
        this.element.style.display = "none"
    }
    show() {
        this.element.style.display = ""
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("CONTENT", "o-content", Content)
        this.addBox("BOX", "o-box", Box)
        this.addBox("MENUBAR", "o-menubar", Menubar)
    }
    onUnitLoad() {

    }
}

module.exports = Palette
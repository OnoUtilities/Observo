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
        this.config = new ConfigManager(this)
        this.posX = -888
        this.posY = 0

        this.dPosX = 888
        this.dPosY = 666

        this.gridX = 0
        this.gridY = 0

    }
    updatePosition(x, y, time) {
        //keyframes
        this.element.style.pointerEvents = "none"
        let keyframes = [
            { transform: `translate(${this.posX}px, ${this.posY}px)` }, //to
            { transform: `translate(${x}px, ${y}px)` } //from
        ]
        //timings
        let timing = {
            duration: time,
            iterations: 1,
            easing: "ease",
            fill: "forwards"
        }

        let animation = this.element.animate(
            keyframes,
            timing
        )
        this.posX = x
        this.posY = y

        let me = this
        animation.onfinish = function () {
            me.element.style.pointerEvents = ""
        };
    }
    moveTo(x, y, time = 1000) {
        x = this.posX + (this.dPosX * x)
        y = this.posY + (this.dPosY * Y)
        this.updatePosition(time)
    }
    moveUp(time = 750) {
        let y = this.posY + this.dPosY
        this.updatePosition(this.posX, y, time)
    }
    moveDown(time = 750) {
        let y = this.posY - this.dPosY
        this.updatePosition(this.posX, y, time)
    }
    moveLeft(time = 750) {
        let x = this.posX + this.dPosX
        this.updatePosition(x, this.posY, time)
    }
    moveRight(time = 750) {
        let x = this.posX - this.dPosX
        this.updatePosition(x, this.posY, time)
    }

    /**
     * ---------------------------------------------
     */
    hide() {
        this.element.style.display = "none"
    }
    show() {
        this.element.style.display = ""
    }
}
class ConfigManager {
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

        this.configPath = path.join(home, '.observo/config.json')
        this.serverList = path.join(home, '.observo/serverList.json')

        if (!jetpack.exists(this.configPath)) {
            const template_c = require('../../../../common/explorer/palettes/main/templates/config.json')
            jetpack.write(this.configPath, template_c)
        }
        try {
            const config = require(this.configPath)
            this.config = config;
        } catch (e) {
            this.config = null
        }

        this.reloadServers()

        this.configContent = JSON.parse(jetpack.read(this.configPath))
    }
    reloadServers() {
        if (!jetpack.exists(this.serverList)) {
            const template_r = require('../../../../common/explorer/palettes/main/templates/serverList.json')
            jetpack.write(this.serverList, template_r)
        }
        try {
            const servers = require(this.serverList)
            this.servers = servers
        } catch (e) {
            this.servers = null
        }
        this.serverContent = JSON.parse(jetpack.read(this.serverList))
    }
    getServers() {
        this.reloadServers()
        return this.servers
    }

    /**
     * Returns information on a selected server
     * @param {string} name The name of the server you would like information on
     * @returns {Object} A JSON object of the selected server
     */
    getServerInfo(name) {
        return this.serverContent[name]
    }

    /**
     * Add a server based on the three provided parameters
     * @param {string} name Name of the server that will be set in the config file [NO SPACES]
     * @param {string} title Title of the server that will be shown in the server listings
     * @param {string} ip IP of the server that will be used to connect
     */
    addServer(name, title, ip, outhKey = null) {
        this.serverContent[name] = {
            "name": title,
            "ip": ip,
            "outhKey": outhKey
        }
        jetpack.write(this.serverList, JSON.stringify(this.serverContent, null, 4))
        console.log("SERVER [" + name + "] added with the title of [" + title + "] and the IP of [" + ip + "]")
    }

    /**
     * Edit a single value of a server listing
     * @param {stirng} name Name of the server you wish to edit
     * @param {string} key Typically "name" or "ip", but can be anything
     * @param {any} value Any value you'd like to set
     */
    editServer(name, key, value) {
        this.serverContent[name][key] = value;
        jetpack.write(this.serverList, JSON.stringify(this.serverContent, null, 4))
        console.log("SERVER [" + name + "] edited to have the [" + key + "] of [" + this.serverContent[name][key] + "]")
    }

    /**
     * Delete a server from the server list file
     * @param {string} name Name of the server you wish to delete
     */
    deleteServer(name) {
        console.log(this.serverContent)
        delete this.serverContent[name]
        console.log(this.serverContent)
        jetpack.write(this.serverList, JSON.stringify(this.serverContent, null, 4))
        console.log("SERVER [" + name + "] DELETED")
    }

    /**
     * Converts an inputed file into base64 with the option to convert it into a dataURL for img tags
     * @param {String} file Path (can be relative or absolute) to image file [WILL BE UPDATE FOR ADDITIONAL INPUT]
     * @param {Boolean} returnDataURL Return a format usable in the "src" attribute for the image tag
     */
    fileToB64(file, returnDataURL) {
        let fileContents = jetpack.read(file, "buffer") //Import an image as binary buffer
        let arr = new Uint8Array(fileContents); //Get an integer array based on the buffer
        let raw = String.fromCharCode.apply(null, arr); //Passes the array to the string converter (Normally would have to be a for loop, but "apply" circumvents that)
        let b64 = btoa(raw); //Encodes a string into base64. Use "atob(b64);" for proof
        if (returnDataURL) { //If the caller would like just the base64, they specify otherwise
            return "data:image/jpeg;base64," + b64; //Put into a readable format for the "src" attribute
        }
        return b64.toString() //Make sure that b64 is a String and return
    }

    /**
     * Returns entire JSON of config file
     * @returns {Object} ConfigContent JSON of entire file
     */
    readAll() {
        return this.configContent
    }

    /**
     * Returns a specific key or value in config file (subKey can be grabbed from both Objects and Arrays)
     * @param {string} key Key to get value of, or if subValue is specified, set the parent object/array to get from
     * @param {string} subKey Subkey of parent object/array
     * @returns {any} Specific key or value (altered by params)
     */
    readValue(key, subKey) {
        subKey = subKey || null
        if (subKey != null) {
            console.log("SUBKEY DEFINED")
            console.log(Object.values(this.configContent[key]))
            return Object.values(this.configContent[key])[subKey]
        }
        console.log("SUBKEY NOT DEFINED")
        return this.configContent[key]
    }


    /**
     * Overwrite entire file with string
     * @param {string} contentIn Entire contents of file to write
     */
    writeAll(contentIn) {
        require("fs-jetpack").write(this.configPath, contentIn)
    }

    /**
     * Creates or changes a single value in the config file
     * TODO: Modify for "infinite" subkey depth for presets
     * @param {string} key Key to write to
     * @param {any} subKey [IF DEFINED] Subkey of parent key to write value to
     * @param {any} value Value to write to selected key
     */
    writeValue(key, subKey, value) {
        console.log(arguments.length)
        if (arguments.length === 2) {
            subKey = null
            value = arguments[arguments.length - 1] //"value" is always the last given argument
            console.log(subKey)
            console.log(arguments.length - 1)
            console.log(value)
            this.configContent[key] = value
            jetpack.write(this.configPath, JSON.stringify(this.configContent, null, 4))
            console.log("Key [" + key + "] written to " + this.configPath + " with value [" + value + "]")
        }
        if (arguments.length === 3) {
            this.configContent[key][subKey] = value
            jetpack.write(this.configPath, JSON.stringify(this.configContent, null, 4))
            console.log("Key [" + key + "." + subKey + "] written to " + this.configPath + " with value [" + value + "]")
        }
    }

    /**
     * Returns either the current theme name or the index of the current theme
     * @param {boolean=} themeName If true, return the name of the current theme, not the index
     * @returns {(number|string)} Index of current theme or name of current theme
     */
    getTheme(themeName) { //If themeName is not defined or false, return just the index of the theme
        themeName = themeName || null
        if (themeName != null && themeName) {
            return Object.keys(this.configContent.themes)[this.configContent.theme]
        }
        return this.configContent.theme
    }

    /**
     * Returns an array of installed themes, or the number of themes installed
     * @param {boolean} nameOfThemes Return the name of the themes rather than their values [MUST BE TRUE TO GET LENGTH]
     * @param {boolean} getValues Return the values of installed themes (EX: theme_default) [nameOfThemes MUST BE SPECIFIED TO GET VALUES]
     * @returns {string[]|number} A list of themes listed in the config file or the number of themes (starting at 0)
     */
    getInstalledThemes(nameOfThemes, getValues) {
        nameOfThemes = nameOfThemes || null
        getValues = getValues || null
        if (getValues != null && getValues) {
            return Object.keys(this.configContent.themes).length
        }
        if (nameOfThemes != null && nameOfThemes) {
            return Object.values(this.configContent.themes)
        }
        return Object.keys(this.configContent.themes)
    }

    /**
     * Returns the current language
     * @returns {string} Current language in config file
     */
    getLanguage(languageName) {
        languageName = languageName || null
        if (languageName != null && languageName) {
            return Object.keys(this.configContent.languages)[this.configContent.language]
        }
        return this.configContent.language
    }

    /**
     * Returns an array of installed languages, or the number of installed languages
     * @param {boolean} nameOfLanguages Return the name of the languages rather than their values [MUST BE TRUE TO GET LENGTH]
     * @param {boolean} getValues return the values of installed languages (EX: en_US) [nameOfLanguages MUST BE SPECIFIED TO GET VALUES]
     * @returns {string[]|number} A list of langues listed in the config file or the number of languages (starting at 0)
     */
    getInstalledLanguages(nameOfLanguages, getValues) {
        nameOfLanguages = nameOfLanguages || null
        getValues = getValues || null
        if (getValues != null && getValues) {
            return Object.keys(this.configContent.languages).length
        }
        if (nameOfLanguages != null && nameOfLanguages) {
            return Object.values(this.configContent.languages)
        }
        return Object.keys(this.configContent.languages)
    }

    /**
     * Returns the current version number
     * @returns {string} Version number (with decimals) EX: "12.1.1"
     */
    getVersion() {
        return this.configContent.version;
    }

    /**
     * Returns whether or not this the first usage
     * @returns {boolean} Whether or not this is the first time the user is using the program
     */
    isFirstUse() {
        return this.configContent.first_use
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
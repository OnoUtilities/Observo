/**
 * MAIN Palette - Commonly used Box Elements
 */

const jetpack = require('fs-jetpack')
const path = require('path')

class ConfigManager {
    constructor(parent) {
        this.parent = parent

        this.loaded = false
        this.file = ""

        const cwd = process.cwd()
        const portableHome = path.join(cwd, 'portable')
        if (jetpack.exists(portableHome)) {
            process.env.OBSERVO_HOME = portableHome
        }
        const home = process.env.OBSERVO_HOME || require('os').homedir()
        this.home = home

        this.presets = path.join(home, '.observo/presets/')

        this.configPath = path.join(home, '.observo/config.json')
        this.serverList = path.join(home, '.observo/serverList.json')

        if (!jetpack.exists(this.configPath)) {
            const template_c = require('../../../../assets/templates/config.json')
            jetpack.write(this.configPath, template_c)
        }
        try {
            const config = require(this.configPath)
            this.config = config;
        } catch (e) {
            this.config = null
        }

        if (!jetpack.exists(this.serverList)) {
            const template_r = require('../../../../assets/templates/serverList.json')
            jetpack.write(this.serverList, template_r)
        }
        try {
            const servers = require(this.serverList)
            this.servers = servers
        } catch (e) {
            this.servers = null
        }

        this.configContent = JSON.parse(jetpack.read(this.configPath))
        this.serverContent = JSON.parse(jetpack.read(this.serverList))
    }

    getServers() {
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
    addServer(name, title, ip) {
        this.serverContent[name] = {
            "name": title,
            "ip": ip
        }
        jetpack.write(this.serverList, JSON.stringify(this.serverContent, null, 4))
        console.log("SERVER [" + name + "] added with the title of [" + title + "] and the IP of [" + ip + "]")
    }

    /**
     * Edit a single value of a server listing
     * @param {string} name Name of the server you wish to edit
     * @param {string} key Typically "name" or "ip", but can be anything
     * @param {any} value Any value you'd like to set
     */
    editServer(name, key, value) {
        this.serverContent[name][key] = value;
        jetpack.write(this.serverList, JSON.stringify(this.serverContent, null, 4))
        console.log("SERVER [" + name + "] edited to have the [" + key + "] of [" + this.serverContent[name][key] + "]")
    }

    /**
     * Once connection is established and "Remember me" is checked, get an authkey from the server for automatic login
     * @param {string} serverName Name of server you are connecting to
     * @param {*} key Key received from the server
     */
    addAuthKey(serverName, key) {
        this.editServer(serverName, "authKey", key)
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
            //console.log("SUBKEY DEFINED")
            console.log(Object.values(this.configContent[key]))
            return Object.values(this.configContent[key])[subKey]
        }
        //console.log("SUBKEY NOT DEFINED")
        return this.configContent[key]
    }


    /**
     * Overwrite entire file with string
     * @param {string} contentIn Entire contents of file to write
     */
    writeAll(contentIn) {
        jetpack.write(this.configPath, contentIn)
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

class DocTabs extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-doctabs/doctabs.html")
    }
}

class Loader extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-loader/loader.shadow.html") //NOT EMPTY
        this.loadContent() //DOES NOT EXIST
    }
}

class Box extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-box/box.shadow.html") //NOT EMPTY
        this.loadContent() //DOES NOT EXIST
    }
}

class Preferences extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-preferences/preferences.html")
    }
    onContentLoad() {
        let config = new ConfigManager(this)

        let themeSelector = new xel.Select(this.element.querySelector("#themeSelector"))
        for (var i = 0; i < config.getInstalledThemes(true, true); i++) { //ADDS ALL THEMES [TODO: Make neater]
            var selectedTheme = false;
            if (config.getInstalledThemes()[i] == config.getTheme(true)) selectedTheme = true //If the current theme in the array equals the current theme, make it selected
            themeSelector.addItem(config.getInstalledThemes()[i], config.getInstalledThemes(true)[i], null, selectedTheme) //"null" is for the "icon" value, which is not needed
        }

        let languageSelector = new xel.Select(this.element.querySelector("#languageSelector"))
        for (var i = 0; i < config.getInstalledLanguages(true, true); i++) { //ADDS ALL LANGUAGES [TODO: Make neater]
            var selectedLanguage = false;
            if (config.getInstalledLanguages()[i] == config.getLanguage(true)) selectedLanguage = true //If the current Language in the array equals the current language, make it selected
            languageSelector.addItem(config.getInstalledLanguages()[i], config.getInstalledLanguages(true)[i], null, selectedLanguage) //"null" is for the "icon" value, which is not needed
        }

        let notificationsButton = this.element.querySelector("#notifications")
        if (config.readValue("notifications")) {
            notificationsButton.setAttribute("toggled", "")
        }

        let soundsButton = this.element.querySelector("#resetWarning")
        if (config.readValue("sounds")) {
            soundsButton.setAttribute("toggled", "")
        }

        let restartWarning = this.element.querySelector("#resetWarning")
        let applyButton = new xel.Button(this.element.querySelector("#applyPreferences"))

        let getState = (element) => { //Compatable with checkboxes, switches, singe radio buttons, and possibly other things that are given the "toggled" attribute
            return (element.getAttribute("toggled") != null)
        }

        /*
        let customPreferances = new getFromPreset(this).customPreferances

        for(preferance in JSON.parse(customPreferances)){
            console.log(preferance)
        }
        */

        applyButton.onClick(() => {
            config.writeValue("theme", themeSelector.value)
            document.getElementsByTagName("body")[0].className = themeSelector.value ///////////////Possibly add theme preview////////////////            

            //TODO: Detect whether the following elements have been changed and display the restart warning
            config.writeValue("language", languageSelector.value)
            config.writeValue("sounds", getState(soundsButton))
            config.writeValue("notifications", getState(notificationsButton))
        })

        let cancelButton = new xel.Button(this.element.querySelector("#cancel"))
        cancelButton.onClick(() => {
            fl.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").preferences.preferencesDialog.close()
        })
    }
}

class PreferencesHandler {
    constructor(p) {
        this.preferencesDialog = new xel.Dialog()
        this.preferencesDialog.dialog.innerHTML = '<o-preferences></o-preferences>'
        this.preferencesDialog.dialog.className = "preferences"
        this.prefrenceButton = new xel.MenuItem("#file-preferences")
        this.prefrenceButton.onClick(() => {
            this.preferencesDialog.open()
        })
    }
}

class Help extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-help/help.html")
    }
}

class HelpHandler {
    constructor(p) {
        let helpMenu = new xel.Dialog()
        helpMenu.dialog.innerHTML = '<o-help></o-help>'
        this.help = new xel.MenuItem("#help")
        this.help.onClick(() => {
            helpMenu.dialog()
        })
    }
}

class ListUsers { //Orginize and document. Will be heavily modified for API integration
    constructor(p) {
        this.mainArea = document.querySelector("#userlist") //Select the o-box with ID "userlist"
        this.userActionDialog = new xel.Dialog();
        //Something to check if any values actually exist, so that the default message is displayed by default

        this.mainArea.innerHTML = "" //Get rid of default (no user) message
        //Assumes that their avatar is already converted to base64 in storage. If not, add FileToB64 function
        this.userData = JSON.parse(jetpack.read("./assets/devUserList.json"))
        this.connectedUsers = [] //A list of listed users available for other classes. called by ID and array position matches list position starting at 0

        for (var i = 0; i < this.userData.users.length; i++) { //For every user in devUserList.json, add an element
            this.addUser(this.userData.users[i])
        }

        //console.log(getListedUsers()) //Prints listed users
        //removeUserFromList("c9c8d3ed90c055dd0b963aa1dd3d74ed") //Test the functionality of the remove user function by removing the last user
    }

    addUser(inputUserData) {
        let currentUserInfo = inputUserData
        let currentUserID = currentUserInfo.ID //Get the unique hash ID of the user
        this.connectedUsers.push(currentUserID)

        let roles = this.userData.roles
        let permissions = roles[currentUserInfo.role];
        let kickStatus = "disabled"
        let banStatus = "disabled"
        let editRoleStatus = "disabled"
        if (permissions["Can kick"]) {
            kickStatus = ""
        }
        if (permissions["Can ban"]) {
            banStatus = ""
        }
        if (permissions["Can edit roles"]) {
            editRoleStatus = ""
        }

        function listRoles(userID){
            var out = `<x-select id="${userID}"><x-menu>`
            for(var role in roles){
                out += `<x-menuitem value="${role}" selected="${roles[role] == roles[currentUserInfo.role]}"><x-label>${roles[role]["name"]}</x-label></x-menuitem>`
            }
            out += `</x-menu></x-select>`
            return out
        }

        let template =
            `<o-box flex row style="flex: 0 0 auto;" class="userListItem" id="listItem-${currentUserID}">
                <o-box flex row-center class="userAvatar">
                    <img src="data:image/png;base64,${currentUserInfo.avatar}">
                </o-box>
                <o-box flex row-center class="userName">
                    <x-label>${currentUserInfo.name}</x-label>
                </o-box>
                <o-box flex row-center class="roleName">
                    <x-button id="roleButton-${currentUserID}"><x-label>${this.userData.roles[currentUserInfo.role].name}</x-label></x-button>
                </o-box>
                <o-box flex row-center class="actionsButton">
                    <x-menubar>
                        <x-menuitem id="actionsMenu-${currentUserID}">
                            <x-label>Actions</x-label>
                            <x-menu>
                                <x-menuitem value="kick" id="kickButton-${currentUserID}" ${kickStatus}>
                                    <x-label>Kick</x-label>
                                </x-menuitem>
                                <x-menuitem value="ban" id="banButton-${currentUserID}" ${banStatus}>
                                    <x-label>Ban</x-label>
                                </x-menuitem>
                                <x-menuitem value="editRole" id="editRoleButton-${currentUserID}" ${editRoleStatus}>
                                    <x-label>Edit Role</x-label>
                                </x-menuitem>
                            </x-menu>
                    </x-menubar>
                </o-box>
            </o-box>
            <hr />`
        this.mainArea.insertAdjacentHTML("beforeend", template)
        this.mainArea.querySelector("#actionsMenu-" + currentUserID).addEventListener("click", () => {
            this.mainArea.querySelector("#kickButton-" + currentUserID).addEventListener("click", () => {
                this.kickDialog = this.userActionDialog
                this.kickDialog.dialog.className = "roleDialog"
                this.kickDialog.dialog.innerHTML = `<h1>Kick <span title="ID - ${currentUserID}" class="name">${currentUserInfo.name}</span>?</h1><x-box horizontal><x-button id="confirm"><x-label>Yes</x-label></x-button><x-button id="cancel"><x-label>No</x-label></x-button></x-box>`
                this.kickDialog.open();
                this.confirmButton = new xel.Button(this.kickDialog.dialog.querySelector("#confirm"))
                this.confirmButton.onClick(() => {
                    console.log("CONFIRMED")
                })
                this.cancelButton = new xel.Button(this.kickDialog.dialog.querySelector("#cancel"))
                this.cancelButton.onClick(() => {
                    console.log("CANCELED")
                })
            })
            this.mainArea.querySelector("#banButton-" + currentUserID).addEventListener("click", () => {
                this.banDialog = this.userActionDialog
                this.banDialog.dialog.className = "roleDialog"
                this.banDialog.dialog.innerHTML = `<h1>Ban <span title="ID - ${currentUserID}" class="name">${currentUserInfo.name}</span>?</h1><x-box horizontal><x-button id="confirm"><x-label>Yes</x-label></x-button><x-button id="cancel"><x-label>No</x-label></x-button></x-box>`
                this.banDialog.open();
                this.confirmButton = new xel.Button(this.banDialog.dialog.querySelector("#confirm"))
                this.confirmButton.onClick(() => {
                    console.log("CONFIRMED")
                })
                this.cancelButton = new xel.Button(this.banDialog.dialog.querySelector("#cancel"))
                this.cancelButton.onClick(() => {
                    console.log("CANCELED")
                })
            })
            this.mainArea.querySelector("#editRoleButton-" + currentUserID).addEventListener("click", () => {
                let editRoleDialog = this.userActionDialog
                editRoleDialog.dialog.className = "roleDialog"
                editRoleDialog.dialog.innerHTML = `<h1>Edit role for <span title="ID - ${currentUserID}">${currentUserInfo.name}</span></h1><span class="rollList">${listRoles(currentUserID)}</span>` //Placeholder HTML for edit user role dialog
                editRoleDialog.open();
                this.confirmButton = new xel.Button(this.kickDialog.dialog.querySelector("#confirm"))
                this.confirmButton.onClick(() => {
                    console.log("CONFIRMED")
                })
            })
        })
    }

    removeUser(userID) { //Pass just the ID string to remove user from list
        mainArea.removeChild(mainArea.querySelector("#listItem-" + userID))
    }

    getUsers() {
        return connectedUsers
    }
}

class DisconnectHandler {
    constructor(p) {
        let item = new xel.MenuItem("#file-disconnect")
        item.onClick(() => {
            prompt.show("Do you want to disconnect?", () => {
                p.openExplorer()
            })
        })
    }
}

class Content extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-content/content.shadow.html")
        this.loadContent("elements/o-content/content.html")
    }
    onUnitLoad() {
        let me = this
        this.preferences = new PreferencesHandler(me)
        this.connectionInfo = new DisconnectHandler(me)
        this.helpInfo = new HelpHandler(me)
        this.userList = new ListUsers(me)
        let configManager = new ConfigManager(me);
    }
    openExplorer() {
        let mainWin = managerRemote.createWindow({
            show: false,
            backgroundColor: '#420024',
            frame: false,
            resizable: true,
            maximizable: true,
            backgroundColor: 'gray',
            webPreferences: {
                zoomFactor: 0.9,
            },
            icon: path.join(managerRemote.getDir(), 'assets/icons/png/1024x1024.png')
        })
        mainWin.setURL(managerRemote.getDir(), "explorer.html")
        mainWin.win.setFullScreenable(false)
        mainWin.win.setResizable(false)
        mainWin.win.setMinimumSize(800, 600);
        mainWin.win.setMaximumSize(800, 600);
        mainWin.win.webContents.on('did-finish-load', () => {
            mainWin.win.show()
            win.close();

        });
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("DOCTABS", "o-doctabs", DocTabs)
        this.addBox("LOADING", "o-loader", Loader)
        this.addBox("BOX", "o-box", Box)
        this.addBox("CONTENT", "o-content", Content)
        this.addBox("PREFERENCES", "o-preferences", Preferences)
        this.addBox("HELP", "o-help", Help)
    }
}

module.exports = Palette //Needed to work
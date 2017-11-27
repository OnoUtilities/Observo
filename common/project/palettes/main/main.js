/**
 * MAIN Palette - Commonly used Box Elements
 */

const jetpack = require('fs-jetpack')
const path = require('path')

class MenuBar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-menubar/menubar.shadow.html")
        this.loadContent("elements/o-menubar/menubar.html")
    }
    onContentLoad() {
        let data = managerLocal.parseArgs()

        this.title_menubar = new xel.TitleMenubar(data.id, "#menubar")
        this.title_menubar.addClose()
        this.title_menubar.addMinimize()
        this.title_menubar.addZoom()
        this.title_menubar.build()
    };
}

class StorageSystem {
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
        this.serverList = path.join(home, '.observo/serverList.json')


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
     * Converts an inputed file into base64 with the option to convert it into a dataURL for img tags
     * @param {String} file 
     * @param {Boolean} returnDataURL 
     */
    fileToB64(file, returnDataURL) {
        let fileContents = require("fs-jetpack").read(file, "buffer") //import an image as binary buffer
        let arr = new Uint8Array(fileContents); //Get an integer array based on the buffer
        let raw = String.fromCharCode.apply(null, arr); //Passes the array to the string converter (Normally would have to be a for loop, but "apply" circumvents that)
        let b64 = btoa(raw); //Encodes a string into base64. Use "atob(b64);" for proof
        if (returnDataURL) { //If the caller would like just the base64, they specify otherwise
            return "data:image/jpeg;base64," + b64; //Put into a readable format for the "src" attribute
        }
        return b64.toString() //Make sure that b64 is a String and return
    }
}

class DocTabs extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-doctabs/doctabs.shadow.html")
        this.loadContent("elements/o-doctabs/doctabs.html")
    }
}

class Loader extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-loader/loader.shadow.html")
        this.loadContent()
    }
}

class Box extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-box/box.shadow.html")
        this.loadContent()
    }
}

class Prefrences extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-prefrences/prefrences.shadow.html")
        this.loadContent("elements/o-prefrences/prefrences.html")
    }
}

class PrefrencesHandler {
    constructor(p) {
        drawer.drawer.innerHTML = '<o-prefrences></o-prefrences>'
        this.prefrenceButton = new xel.MenuItem("#file-prefrences")
        this.prefrenceButton.onClick(() => {
            drawer.open()
        })
    }
}

class Connect extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-connect/connect.shadow.html")
        this.loadContent("elements/o-connect/connect.html")
    }
}

class ConnectHandler {
    constructor(p) {
        let connectDrawer = new xel.Dialog()
        connectDrawer.dialog.innerHTML = '<o-connect></o-connect>'
        connectDrawer.dialog.style.borderRadius="25px"
        connectDrawer.dialog.style.width="400px"
        this.connectMenuButton = new xel.MenuItem("#connect")
        this.connectMenuButton.onClick(() => {
            connectDrawer.open()
        })
    }
}

/*class Refresh extends forklift.PaletteBox {
    constructor(p){
        super(p)
        this.refreshServer = new xel.MenuItem("#refresh-server")
        this.refreshServer.onClick(() => {
            this.loadBox("elements/o-refresh/refresh.shadow.html")
            this.loadContent("elements/o-refresh/refresh.html")
        })
    }
}*/
//Doesn't Work
//Bruce Needs to fix this
//Help Would be nice :P

class Help extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-help/help.shadow.html")
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
        let mainArea = document.querySelector("#userlist") //Select the o-box with ID "userlist"

        //Something to check if any values actually exist, so that the default message is displayed by default

        mainArea.innerHTML = "" //Get rid of default (no user) message
        //Assumes that their avatar is already converted to base64 in storage. If not, add FileToB64 function
        let userData = JSON.parse(jetpack.read("./assets/devUserList.json"))
        let connectedUsers = [] //A list of listed users available for other classes. called by ID and array position matches list position starting at 0

        function addUserToList(inputUserData) {
            let currentUserInfo = userData.users[i]
            let currentUserID = currentUserInfo.ID //Get the unique hash ID of the user
            connectedUsers.push(currentUserID)

            let permissions = userData.roles[currentUserInfo.role];
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
            let template =
                `<o-box flex row style="flex: 0 0 auto; height: 80px;" id="listItem-${currentUserID}">
                <o-box flex style="padding-top: 5px; flex: 0 0 auto; width: fit-content;">
                    <img style="border-radius: 50%; height: 64px; width: 64px" src="data:image/png;base64,${currentUserInfo.avatar}">
                </o-box>
                <o-box flex style="padding-top: 30px; width: fit-content;">
                    <x-label>${currentUserInfo.name}</x-label>
                </o-box>
                <o-box flex style="padding-top: 20px; flex: 0 0 auto; width: fit-content; margin-right: 10px;">
                    <x-button id="roleButton-${currentUserID}">${userData.roles[currentUserInfo.role].name}</x-button>
                </o-box>
                <o-box flex style="padding-top: 20px; flex: 0 0 auto; width: fit-content; margin-right: 10px">
                    <x-menubar class="actionsMenuBar">
                        <x-menuitem id="actionsMenu-${currentUserID}">
                            <x-label>Actions</x-label>
                            <x-menu>
                                <x-menuitem value="kick" id="kickButton-${currentUserID}" ${kickStatus}>
                                    <x-label>Kick</x-label>
                                </x-menuitem>
                                <x-menuitem value="ban" "banButton-${currentUserID}" ${banStatus}>
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
            mainArea.insertAdjacentHTML("beforeend", template)
            //mainArea.querySelector("#actionsMenu-" + currentUserID).addEventListener("click", userAction(currentUserID))
        }

        function userAction(userID){    //This will be used to add and remove event listeners in order to optimize the actions menu
            mainArea.querySelector("#kickButton-" + userID).addEventListener("click", kick(userID))
            mainArea.querySelector("#banButton-" + userID).addEventListener("click", ban(userID))
            mainArea.querySelector("#editRoleButton-" + userID).addEventListener("click", editRole(userID))
        }

        function kick(userID){
            let kickDialog = new xel.Dialog()
            kickDialog.dialog.innerHTML = `<h1>KICK ${userID}?</h1>`    //Placeholder HTML for kick dialog
            kickDialog.open();
        }
        function ban(userID){
            let banDialog = new xel.Dialog()
            banDialog.dialog.innerHTML = `<h1>Ban ${userID}?</h1>`  //Placeholder HTML for ban dialog
            banDialog.open();
        }
        function kick(userID){
            let editRoleDialog = new xel.Dialog()
            editRoleDialog.dialog.innerHTML = `<h1>Edit role for ${userID}?</h1>`   //Placeholder HTML for edit user role dialog
            editRoleDialog.open();
        }

        function removeUserFromList(userID) { //Pass just the ID string to remove user from list
            mainArea.removeChild(mainArea.querySelector("#listItem-" + userID))
        }

        function getListedUsers(){
            return connectedUsers
        }

        for (var i = 0; i < userData.users.length; i++) { //For every user in devUserList.json, add an element
            addUserToList(userData.users[i])
        }
        console.log(getListedUsers())
        //removeUserFromList("c9c8d3ed90c055dd0b963aa1dd3d74ed") //Test the functionality of the remove user function by removing the last user
    }
}
/*
class userActions {
    constructor(p) {
        for ()
    }
}
*/

class Content extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-content/content.shadow.html")
        this.loadContent("elements/o-content/content.html")
    }
    onUnitLoad() {
        let me = this
        this.prefrences = new PrefrencesHandler(me)
        this.connectionInfo = new ConnectHandler(me)
        this.helpInfo = new HelpHandler(me)
        this.userList = new ListUsers(me)
        let storageSystem = new StorageSystem(this);
    }
}


class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("MENUBAR", "o-menubar", MenuBar)
        this.addBox("DOCTABS", "o-doctabs", DocTabs)
        this.addBox("LOADING", "o-loader", Loader)
        this.addBox("BOX", "o-box", Box)
        this.addBox("CONTENT", "o-content", Content)
        this.addBox("PREFRENCES", "o-prefrences", Prefrences)
        this.addBox("CONNECT", "o-connect", Connect)
        //this.addBox("REFRESH", "o-refresh", Refresh)
        this.addBox("HELP", "o-help", Help)
    }
}

module.exports = Palette //needed to work
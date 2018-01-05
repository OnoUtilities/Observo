

import "OBSERVO.SOCKET.CHANNEL"
import "OBSERVo.GIT"
import "OBSERVO.FILE"

class Session extends Observo.Socket.Channel {
    constructor() {
        super()
    }
    setSession(uuid, sessionKey) {
        this.uuid = uuid
        this.sessionKey = sessionKey
    }
    onConnect(socket) {
        let me = this
        socket.emit("check_api", { api: API })  //Emit API (and optional authKey) via the handshake EVENT to the server
        socket.on("vaild_api", function (data) {
            console.log(me.uuid)
            console.log(me.sessionKey)
            socket.emit("check_user", { uuid: me.uuid, sessionKey: me.sessionKey })
        })
        socket.on("vaild_user", function (data) {
            me.onVaildSession(socket)
        })
        socket.on("invaild_user", function (data) {
            socket.disconnect()
        })
    }
}




class User extends Session {
    constructor() {
        super()
    }
    run(ip, uuid, sessionKey) {
        this.setSession(uuid, sessionKey)
        this.useChannel(ip, "core/user")    
    }
    onVaildSession(socket) {
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
        forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1,-3, 0)
        socket.disconnect()
    }
    onDisconnect(socket) {
      socket.disconnect()
    }
    onError(socket) {
        socket.disconnect()
    }
}



export class Download extends Observo.Git {
    constructor() {
        super()
    }
    clone(url) {
        let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
        let name = url.substring(url.lastIndexOf("/") + 1);
        location = location + "/" + name
        this.downloadFile(url, location, (state) => {
            if (state) {
                console.log("Download Successful")
            } else {
                console.log(error)
            }
        })
    }
}


export class Preset extends Observo.File {
    constructor() {
        super()   
        this.list = {}
    }    
    load() {
        console.log("RUNNING")
        let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
        console.log(this.location)
        this.makeDirectory(location, () => {
            this.presets = this.walkDirectory(location, "manifest.json")
            this.checkPreset()
        })    
    }
    reloadPresets() {
        let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
        this.presets = this.walkDirectory(location, "manifest.json")
        this.checkPreset()
    }
    checkPreset() {
        console.log("CHECKING")
        for (let preset in this.presets) {
            this.parse(this.presets[preset])
        }   
        console.log(this.list)
    }
    parse(data) {
        let json = this.read(data)
        json = JSON.parse(json)
        if (json.PAPI = 1 && json.name != null) {
            this.list[json.id] = json
        }
    }
    getList() {
        return this.list
    }
}

export class Project extends Session {
    constructor() {
        super()
    }
    run(ip, uuid, sessionKey) {
        this.socket = null
        this.ip = ip
        this.setSession(uuid, sessionKey)
        this.useChannel(ip, "core/project")    
    }
    addProject(name) {
        console.log(name)
        //PASS PRESET LATER
        let preset = forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-ADD-PROJECT").select.value
        this.socket.emit("add_project", { name: name, preset: preset })
    }
    clonePreset(url) {
        let download = use("RUNTIME.EXPLORER")["DOWNLOAD"]
        download.clone(url)
        this.socket.emit("add_preset", { url: url })
        use("RUNTIME.EXPLORER")["PRESET"].reloadPresets()

    }
    onVaildSession(socket) {
        let me = this
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
        forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1,-3, 0)
        this.socket = socket
        let presetManager = use("RUNTIME.EXPLORER")["PRESET"]
        socket.on("update_projects", function(data) {
            forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").clearProjects()
            console.print(data.presets["frc_scouting"].name)
            for (let project in data.projects) {
                console.log("dsfiuudgdsifddgfuigdd")
                console.log(data.projects[project].preset)
                if (data.projects[project].preset == "undefined") {
                    forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").add(data.projects[project].name, "Unknown")  
                } else {
                    //console.print(data.presets[`${data.projects[project].preset}`].name)
                    forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").add(data.projects[project].name, `${data.presets[`${data.projects[project].preset}`].name} @ ${data.presets[`${data.projects[project].preset}`].version}`)  
                }
                forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").open(data.projects[project].name, me.ip, me.uuid, me.sessionKey)
            }
        })
        socket.on("update_presets", function(data) {
            forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-MANAGE-PRESET").clearProjects()
            let first = false
            for (let preset in data.presets) {
                //GET CLIENT VERSION TOO AND COMP
                let version = ""
                presetManager.reloadPresets()
                console.print(presetManager.getList())
                console.log("LIST")
                let color = "blue"
                if (presetManager.list[data.presets[preset].id] == undefined) {
                    version = "NOT INSTALLED"
                    color = "red"
                } else {
                    version = presetManager.list[preset].version
                    color = "green"
                }
                forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-MANAGE-PRESET").add(data.presets[preset].name, data.presets[preset].version, version, color)
                let name = `${data.presets[preset].name} @ ${data.presets[preset].version}`
                if (first == false) {
                    first = true
                    forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-ADD-PROJECT").select.addItem(data.presets[preset].id, name, null, true)
                } else {
                    forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-ADD-PROJECT").select.addItem(data.presets[preset].id, name)
                }
            }
        })
        socket.on("vaild_project", function(data) {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        socket.on("invaild_project", function(data) {
            
        })
        
    
        socket.on("slider", function(data) {
            forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").setSlider(data.value)
        })
        socket.emit("update_projects")
        socket.emit("update_presets")
    }
    onSlide(value) {
        console.log("dfhklhfkhdkfjkdsjfdshf")
        this.socket.emit("slider", {value: value})
    }
    onDisconnect(socket) {
       socket.disconnect()
    }
    close() {
        this.socket.disconnect()
    }
    onError(socket) {
       socket.disconnect()
    }
}



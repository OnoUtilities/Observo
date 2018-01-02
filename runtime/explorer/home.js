

import "OBSERVO.SOCKET.CHANNEl"


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


export class Project extends Session {
    constructor() {
        super()
    }
    run(ip, uuid, sessionKey) {
        this.socket = null
        this.setSession(uuid, sessionKey)
        this.useChannel(ip, "core/project")    
    }
    addProject(name) {
        console.log(name)
        //PASS PRESET LATER
        let preset = null
        this.socket.emit("add_project", { name: name, preset: preset })
    }
    onVaildSession(socket) {
        forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").hide()
        forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1,-3, 0)
        this.socket = socket
        socket.on("update_projects", function(data) {
            forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").clearProjects()
            for (let project in data.projects) {
                console.log("PROJECT")
                forklift.App.getPaletteInstance("GRID-SERVER-HOME").getBoxObject("SERVER-HOME").add(data.projects[project].name, data.projects[project].preset)
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
import "Observo.File"
import "Observo.Load"
import "Observo.Socket"


export class Preset extends Observo.File {
        constructor() {
            super()   
            this.list = {}
            this.presets = {}
        }    
        load() {
            let me = this
            console.log("RUNNING")
            let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
            this.makeDirectory(location, () => {
                me.reloadPresets()
            })    
        }
        reloadPresets() {
            let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
            this.presets = this.walkDirectory(location, "manifest.json")
            console.print(this.presets)
            this.checkPreset()
        }
        checkPreset() {
            for (let preset in this.presets) {
                console.log(preset)
                this.parse(this.presets[preset])
            }   
        }
        parse(data) {
            let folder = this.replaceAll(data, "manifest.json", "")
            let json = this.read(data)
            json = JSON.parse(json)
            if (json.PAPI = 1 && json.name != null) {
                this.list[json.id] = json
                this.list[json.id].folder = folder
            }
        }
        replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'ig'), replace)
        }
        getList() {
            return this.list
        }
    }
export class Load extends Observo.Load {
    constructor() {
        super()
    }
    load(location) {
        this.loadStem(location, {
            permissions: ["OBSERVO.CONTENT"],
            vm: {
                console: 'inherit',
                sandbox: {
                    setTimeout,
                }
            },
            base: true
        })
    }
}

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
        this.socket = socket
    }
}

export class Main extends Session {
    constructor() {
        super()
    }

    onVaildSession(socket) {
        /**
         * Chat System
         */
        socket.on("update_chat", function (data) {
            if(data.messages != null) {
               for (let message in data.messages) {
                let message = data.messages[message].message
                let user = data.messages[message].user
                let uuid = data.messages[message].uuid
                let id = data.messages[message].id
                //placeMessage("http://via.placeholder.com/64x64", "testUser", 5678956789, "bottom", this.input.value) //Change to send message once database is complete
   
                forklift.App.getPaletteInstance("CHAT").getBoxObject("CHAT").placeMessage("http://via.placeholder.com/64x64", user, uuid, id, "bottom", message)
               }
            } else if (data.message != null) {
                let message = data.message
                let user = data.user
                let uuid = data.uuid
                let id = data.id
                forklift.App.getPaletteInstance("CHAT").getBoxObject("CHAT").placeMessage("http://via.placeholder.com/64x64", user, uuid, id, "bottom", message)
            }
        })
        /**
         * Sidebar System
         * 
         */
        socket.on("update_sidebar", function(data) {

        })

    }
    onDisconnect(socket) {
      socket.disconnect()
    }
    onError(socket) {
      socket.disconnect()
    }




    /*------------------------------------*/
    sendChatMessage(message) {
        this.socket.emit("on_chat", {message: message})
    }



    /*-------------------------------------*/
    run(args) {
        console.print(args)
        let load = use("RUNTIME.PROJECT")["LOAD"]
        let presets = use("RUNTIME.PROJECT")["PRESET"]
        presets.reloadPresets()
        for (let p in presets.list) {
            console.log(p)
            console.print(presets.list[p].folder)
            if (p == args.preset) {
                let path = presets.list[p].folder + "\\frontend"
                load.load(path)
            }
        }
        console.print(args)
        args.project = args.project.toLowerCase()
        this.setSession(args.uuid, args.sessionKey)
        this.useChannel(args.ip, `core/project/${args.project}`)
    }
    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'ig'), replace)
    }
}

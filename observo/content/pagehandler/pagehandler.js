const uuidv4 = require('uuid/v4'); //Random

class PageHandler {
    constructor() {
        this.pages = {}
        this.instances = {}
    }
    addPage(name, self) {
        this.pages[name] = self
    }
    loadPage(name, uuid = null) {
        let view = PineApple.Chunks.getInstance("OBSERVO.VIEW")
        if (this._isPage(name) && uuid == null) {
            uuid = uuidv4()
            if (this.instances[name] == null) {
                this.instances[name] = {}
            }
            this.instances[name][uuid] = new this.pages[name](uuid)
            let options = {
                name: name
            }
            view.openView(uuid, options, this.instances[name][uuid])
        } else {
            if (this._isInstance(name, uuid)) {
                view.openView(uuid)
            }
        }
    }
    _isPage(name) {
        if (this.pages[name] != null) {
            return true
        }
        return false
    }
    _isInstance(name, uuid) {
        if (this.instances[name][uuid] != undefined) {
            return true
        }
        return false
    }
}
class Handler {
    constructor() {
    }
    addPage(name, self) {
        $addPage(name, self)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: PageHandler,
    handler: Handler,
    enabled: true
})

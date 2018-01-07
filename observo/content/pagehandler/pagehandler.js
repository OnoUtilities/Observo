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
        let element = PineApple.Chunks.getInstance("OBSERVO.CONTENT.ELEMENT")
        
        if (this._isPage(name) && uuid == null) {
            uuid = uuidv4()
            if (this.instances[name] == null) {
                this.instances[name] = {}
            }
            let tag = `${name}-${uuid}`

           
            this.instances[name][uuid] = new this.pages[name](uuid)
            let options = {
                name: name
            }
            element.createElement(tag, this.instances[name][uuid])
            
            view.openView(uuid, options, this.instances[name][uuid])
            let page = view.getView(uuid)
            page.innerHTML = `<${tag}></${tag}>`
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
        console.log(name)
        console.log(uuid)
        if (this.instances[name][uuid] != null) {
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

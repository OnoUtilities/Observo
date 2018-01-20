const uuidv4 = require('uuid/v4'); //Random

class PageHandler {
    constructor() {
        this.pageTypes = {}
        this.instances = {}
        this.initialized = {}
        this.opened = {}
    }
    addPage(self, settings) {
        if (settings != undefined || settings != null) {
            if (settings.type != null) {
                let type = settings.type
                if (this.pageTypes[type] == null) {
                    this.pageTypes[type] = {}
                    this.pageTypes[type].self = self
                    if (settings.name != null) {
                        this.pageTypes[type].name = settings.name
                    }
                    if (settings.dynamic != null) {
                        this.pageTypes[type].dynamic = settings.dynamic
                    }  
                    if (settings.icon != null) {
                        this.pageTypes[type].icon = settings.icon
                    } 
                } else {
                    console.log("Page TYPE already declared " + settings.type)
                }
            }
        } 
    }
    loadPage(type, name, uuid) {
        let view = PineApple.Chunks.getInstance("OBSERVO.VIEW")
        let element = PineApple.Chunks.getInstance("OBSERVO.CONTENT.ELEMENT")

        if (this._isPage(type) && this.opened[uuid] == null) {
            if (this.instances[type] == null) {
                this.instances[type] = {}
            }
            let tag = `${name}-${uuid}`
            tag = tag.replace(/\s/g, '')
            if (this.initialized[uuid] == null) {
                this.instances[type][uuid] = new this.pageTypes[type].self()
                element.createElement(tag, this.instances[type][uuid])
                this.initialized[uuid] = true
            }
            let options = {
                name: name,
                icon:  this.pageTypes[type].icon
          }
           
            view.openView(uuid, options, this.instances[type][uuid])
            let page = view.getView(uuid)
            page.innerHTML = `<${tag}></${tag}>`
            this.opened[uuid] = true
        } else {
            if (this.instances[type] != null) {
                    view.openView(uuid)
            }
        }
    }
    onClose(uuid) {
        delete this.opened[uuid]
    }


    /**
     * Private check for seeing if a page type is real
     * @param {String} type Type of the page 
     */
    _isPage(type) {
        if (this.pageTypes[type] != null) {
            return true
        }
        return false
    }
    /**
     * Check for seeing of a instance is real (aka page is opened)
     */
    _isInstance(name, uuid) {
        if (this.instances[name] != null) {
            if (this.instances[name][uuid] != undefined) {
                return true
            } else {
                return false
            }
        }
        return false
    }
}
class Handler {
    constructor() {
    }
    addPage(type, name, icon, self, settings) {
        $addPage(type, name, icon, self, settings)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: PageHandler,
    handler: Handler,
    enabled: true
})

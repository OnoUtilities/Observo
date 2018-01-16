const uuidv4 = require('uuid/v4'); //Random

class PageHandler {
    constructor() {
        this.pages = {}
        this.uuid = {}
        this.instances = {}
        this.icon = {}
        this.dynamic = {}
    }
    addPage(type, name, icon, self, settings) {
        this.pages[name] = self
        this.icon[name] = icon
    
        if (settings != undefined || settings != null) {
            if (settings.dynamic != null) {
                this.dynamic[name] = true
            }
        }  else {
            this.dynamic[name] = false
        }


        this.uuid[name] = null
        let sidebar = PineApple.Chunks.getInstance("OBSERVO.CONTENT.SIDEBAR")

        sidebar.addPage(type, name, icon, this.dynamic[name])
    }
    loadPage(type, name) {
        let view = PineApple.Chunks.getInstance("OBSERVO.VIEW")
        let element = PineApple.Chunks.getInstance("OBSERVO.CONTENT.ELEMENT")

        if (this._isPage(name) && this.uuid[name] == null) {
            let uuid = uuidv4()
            this.uuid[name] = uuid
            if (this.instances[name] == null) {
                this.instances[name] = {}
            }
            let tag = `${name}-${uuid}`
            tag = tag.replace(/\s/g, '')


            this.instances[name][uuid] = new this.pages[name](uuid)
            let options = {
                name: name,
                icon: this.icon[name]
            }
            element.createElement(tag, this.instances[name][uuid])

            view.openView(uuid, options, this.instances[name][uuid])
            let page = view.getView(uuid)
            page.innerHTML = `<${tag}></${tag}>`
        } else {
            if (this.uuid[name] != null) {
                if (this._isInstance(name, this.uuid[name])) {
                    console.log("sdjkgdsjksdjkfdsjkgdgfskjfsdjfdkfsgjsgfjkdsgfjkdgsfjkgdsjkg")
                    view.openView(this.uuid[name])
                }
            }
        }
    }
    onClose(uuid) {
        //Look all names (key) in the uuid var
        for (let name in this.uuid) {
            //if uuid value matches the uuid value of given name in the uuid var proceed
            if (uuid == this.uuid[name]) { 
                //Check if its a real instance running
                if(this._isInstance(name, uuid)) {
                    //Delete the instance and the uuid out of this class
                    delete this.instances[name][uuid]
                    delete this.uuid[name]
                }
            }
        }
    }
    /**
     * Private check for seeing if a page type is real
     * @param {String} name Name of the page 
     */
    _isPage(name) {
        if (this.pages[name] != null) {
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

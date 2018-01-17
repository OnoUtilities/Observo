class Tab {
    constructor() {
        let me = this
        this.views = {}
        this.instances = {}
        
        this.tabs = new xel.DocTabs("x-doctabs")
        this.tabs.setupTabs()
        
        this.tabs.onTabClose((id) => {
            if (me.instances[id] != null) {
                me.instances[id].onClose()
                delete me.instances[id]
                me.removeView(id)

                let tab = me.tabs.getTabByID(id)
                me.tabs.end(tab);
        
            }
        })
        this.tabs.hideButton()
        this.tabs.onNew((type) => {})
        this.tabs.onTabClick((id) => {
            let last = me.tabs.getLastSelectedTab()
            if (me.instances[last] != null) {
                me.instances[last].onDeselect()
            }
            if (me.instances[id] != null) {
                me.instances[id].onSelect()
            }
            me.showView(id)
        })
    } 
    openView(uuid, options, instance) {
        if (!this._isView(uuid)) {
            this.addView(uuid)

            this.instances[uuid] = instance

            this.tabs.addTab(uuid) 
            let tab = this.tabs.getSelectedTab()
            if (options.name != null) {
                this.tabs.setName(tab, options.name) 
            }
            if (options.icon != null) {
                this.tabs.setIcon(tab, options.icon)
            }
            this.showView(uuid)
            let view = this.getView(uuid)
            let me = this
            let html = uuid
            view.innerHTML = html
            /*
            let feedback = forklift.API.load(file, (data) => {
                if (data != null) {
                    html = data.responseText
                    html = html.split("<template>")[1].split("</template>")[0]
                    View.innerHTML = html
                } else {
                   
                }
            })
            if (!feedback) {
               
            }*/
        } else {
            this.showView(uuid)
            this.tabs.setSelectedTab(uuid)
        }
    }
    addView(uuid) {
        document.querySelector("#content").insertAdjacentHTML("afterbegin", `<section data-id="${uuid}">
        <section   style="position: relative;  margin: auto; margin-top: 20%; right: 0; bottom: 0; left: 0; border-radius: 3px; text-align: center;">
        <x-label style="font-size: 72px;" class="rb-font">
          <span class="bold">LOADING</span>
          </x-label>
      </section>

      </section>`)
        let view = document.querySelector(`[data-id='${uuid}']`)
        this.views[uuid] = view
        
    }
    showView(uuid) {
        if (this._isView(uuid)) {
            for (let view in this.views) {
                this.hideView(view)
            }
            this.getView(uuid).style.display = "block"
        }
    }
    hideView(uuid) {
        if (this._isView(uuid)) {
            this.getView(uuid).style.display = "none"
        }
    }
    removeView(uuid) {
        if (this._isView(uuid)) {
            PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER").onClose(uuid)
            this.getView(uuid).remove()
            delete this.views[uuid]
            //delete baseID if no View exist
        }
    }
    getView(uuid) {
        if (this._isView(uuid)) {
            return this.views[uuid]
        }
        return null
    }
    _isView(uuid) {
        if (this.views[uuid] != undefined) {
           return true
        }
        return false
    }
   
}
class Handler {
    constructor() {}
}
PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Tab,
    handler: Handler,
    enable: true
})

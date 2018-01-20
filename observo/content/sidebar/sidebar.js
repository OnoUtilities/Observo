class Sidebar {
    constructor() {
        this.nodes = {}
        this.subPage = {}
    }
    add(handler) {
        this.handler = handler
    }
    updateSidebar(data) {
        let used_pages = {}
        let pageHandler = PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER")
        for (let type in pageHandler.pageTypes) {
            for (let index in data.pages) {
                let page = data.pages[index]
                if (page.type == type) {
                    used_pages[type] = page
                    if (pageHandler.pageTypes[type].dynamic) {
                        this.addPage(type, pageHandler.pageTypes[type].name, pageHandler.pageTypes[type].icon, true)
                        this.addSubNode(type, page.name, page.uuid)
                    } else {
                        this.addPage(type, pageHandler.pageTypes[type].name, pageHandler.pageTypes[type].icon, false, page.uuid)
                    }
                }
            }
        }

    }
    addPage(type, name, icon, dynamic, uuid = null) {
        let me = this
        if (this.nodes[type] == null) {
            this.nodes[type] = {}
            this.nodes[type].node = forklift.App.getPaletteInstance("SIDEBAR").getBoxObject("SIDEBAR").sidebar.addNode(name)
            this.nodes[type].node.setTitle(name)
            this.nodes[type].node.setIcon(icon)
            this.nodes[type].name = name
            this.nodes[type].icon = icon

            if (!dynamic) {
                this.nodes[type].node.onClick(() => {
                    PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER").loadPage(type, name, uuid)
                })
            } else {
                let contextmenu = new xel.ContextMenu()
                this.nodes[type].node.onContextMenu(() => {
                    contextmenu.openTemp((temp, items) => {
                        let new_sub = temp.addItemAbove(`New ${name}`)
                        new_sub.setTitle(`New ${name}`)
                        new_sub.onClick(() => {
                            dialogInput.open({
                                title: `New ${name}`,
                                place_holder: `${name} Name`,
                                max_length: 20,
                                min_length: 3
                            }, (self) => {
                                return { status: true, hint: "Name already used" }
                            }, (self) => {
                                let subName = self.input.value
                                this.handler.onNewPage(type, subName)
                                temp.close()
                            })
                        });
                    })
                })
            }
        }


        //this.nodes[type].setIcon(name)
        //this.nodes[type].onContentMenu(()=>{//do stuff})

    }
    //VIA DATABASE
    addSubNode(type, name, uuid) {
        if (this.nodes[type] != null) {
            if (this.subPage[type] == null) {
                this.subPage[type] = {}
            }
            if (this.subPage[type][name] == null) {
                this.subPage[type][name] = {}
                this.subPage[type][name].name = this.nodes[type].node.getTitle() + ": " + name
                this.subPage[type][name].node = this.nodes[type].node.addNode(uuid)
                this.subPage[type][name].node.setTitle(name)
                this.subPage[type][name].node.setIcon(this.nodes[type].icon)

                let contextmenu = new xel.ContextMenu()
                this.subPage[type][name].node.onContextMenu(() => {
                    contextmenu.openTemp((temp, items) => {
                        let del = temp.addItemAbove(`delete`)
                        del.setTitle(`Delete ${name}`)
                        del.onClick(() => {
                            //do you want to delete this page?
                        })
                    })
                })
                this.subPage[type][name].node.onClick(() => {
                    PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER").loadPage(type, name, uuid)
                })

            }
        }
    }
}
class Handler {
    constructor() {
        $add(this)
    }
    updateSidebar(data) {
        $updateSidebar(data)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Sidebar,
    handler: Handler,
    enabled: true
})

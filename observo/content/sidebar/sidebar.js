class Sidebar {
    constructor() {
      this.nodes = {}
      this.subNodes = {}
    }
    //VIA USER
    addPage(type, name) {

        this.nodes[type] = forklift.App.getPaletteInstance("SIDEBAR").getBoxObject("SIDEBAR").sidebar.addNode(name) 
        this.nodes[type].setTitle(name)
        this.nodes[type].setIcon("home")
        this.nodes[type].onClick(() => {
            PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER").loadPage(type, name, null)
        })
        //this.nodes[type].setIcon(name)
        //this.nodes[type].onContentMenu(()=>{//do stuff})
        
    }
    //VIA DATABASE
    addSubNode(type, name, uuid) {

    }
}
class Handler {
    constructor() {

    }
    addPage(type, name) {

    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Sidebar,
    handler: Handler,
    enabled: true
})

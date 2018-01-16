class Sidebar {
    constructor() {
      this.nodes = {}
      this.subNodes = {}
    }
    //VIA USER
    addPage(type, name, icon, dynamic) {
        console.log(dynamic)
        this.nodes[type] = forklift.App.getPaletteInstance("SIDEBAR").getBoxObject("SIDEBAR").sidebar.addNode(name) 
        this.nodes[type].setTitle(name)
        this.nodes[type].setIcon(icon)
        if (!dynamic) {
           this.nodes[type].onClick(() => {
               PineApple.Chunks.getInstance("OBSERVO.CONTENT.PAGEHANDLER").loadPage(type, name)
           })  
        } else {
            let contextmenu = new xel.ContextMenu()
            this.nodes[type].onContextMenu(() => {
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
                            let name = self.input.value
                           console.log(name)
                            temp.close()
                        })
                    });
                })
            }) 
        }
       
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

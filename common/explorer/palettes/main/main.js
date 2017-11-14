/**
 * MAIN Palette - Commonly used Box Elements
 */
class MenuBar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-menubar/menubar.shadow.html")
        this.loadContent("elements/o-menubar/menubar.html")
    }
    onContentLoad() {
        let data = managerLocal.parseArgs()

        this.title_menubar = new xel.TitleMenubar(data.id, "#menubar")
        this.title_menubar.addClose()
        this.title_menubar.addMinimize()
        this.title_menubar.addZoom()
        this.title_menubar.build()
    }
}
class Loader extends forklift.PaletteBox {
    constructor(p) {
       super(p) 
       this.loadBox("elements/o-loader/loader.shadow.html")
       this.loadContent()
    }   
}

class Box extends forklift.PaletteBox {
    constructor(p) {
       super(p) 
       this.loadBox("elements/o-box/box.shadow.html")
       this.loadContent()
    }   
}

class Content extends forklift.PaletteBox {
    constructor(p) {
       super(p) 
       this.loadBox("elements/o-content/content.shadow.html")
       this.loadContent("elements/o-content/content.html")
    }   
}


class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("MENUBAR", "o-menubar", MenuBar)
        this.addBox("LOADING", "o-loader", Loader)
        this.addBox("BOX", "o-box", Box)
        this.addBox("CONTENT", "o-content", Content)
    }
}

module.exports = Palette //needed to work


class MenuBar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-menubar/menubar.html")
    }
    onContentLoad() {
        let data = managerLocal.parseArgs()

        this.title_menubar = new xel.TitleMenubar(data.id, "#menubar")
        this.title_menubar.addClose()
        this.title_menubar.addMinimize()
        this.title_menubar.addZoom()
        this.title_menubar.build()
    };
}


class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)

        this.addBox("BAR", "o-menubar", MenuBar)
    }
}

module.exports = Palette
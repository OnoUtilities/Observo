class Sidebar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
    }
}

class View extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-sidebar-view/sidebar-view.shadow.html")
        this.loadContent("elements/o-sidebar-view/sidebar-view.html")
    }
}


class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("SIDEBAR", "o-sidebar", Sidebar)
        this.addBox("SIDEBAR-VIEW", "o-sidebar-view", View)
    }
}

module.exports = Palette
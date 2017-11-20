class Sidebar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
    }
    onContentLoad() {
        let me = this
        this.contentBox = this.element.querySelector("o-box")
        
        
    }
    show() {
        this.contentBox.style.width = "200px"
        this.contentBox.style.display = ""
    }
    hide() {
        this.contentBox.style.width = "0px"
        this.contentBox.style.display = "none"
    }

}

class View extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-sidebar-view/sidebar-view.shadow.html")
        this.loadContent("elements/o-sidebar-view/sidebar-view.html")
        this.toggle = false

        this.menubar = forklift.App.getPaletteInstance("MAIN").getBoxObject("MENUBAR")
    }
    onUnitLoad() {
        let me = this
        let run = () => {
            if (me.toggle) {
                me.show(true)
            } else {
                me.show(false)
            }
        }
        this.parent = forklift.App.getPaletteInstance("SIDEBAR").getBoxObject("SIDEBAR")

        this.sidebarItem = new xel.MenuItem("#view-sidebar")
    
        this.sidebarItem.onClick(() => {
            run()
        });
        this.sidebarItem.setIcon("check")

        this.element.addEventListener("click", run)
    }
    show(data) {
        if (data == false || data == "false") {
            this.wait = true
            this.parent.hide()
            this.element.setAttribute("show", "false")
            this.toggle = true
            this.wait = false
            this.sidebarItem.setIcon("")
            this.callEvent("onSidebarResize", [false])
        } else {
            this.wait = true
            this.parent.show()
            this.element.setAttribute("show", "true")
            this.toggle = false
            this.wait = false
            this.sidebarItem.setIcon("check")
            this.callEvent("onSidebarResize", [true])
        }
    }
    onAttributeChange(name, oldValue, newValue) {
        if (name == "show" && !this.wait) {
            this.show(newValue)
        }
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
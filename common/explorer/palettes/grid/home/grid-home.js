class Home extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-home/grid-home.shadow.html")
        this.loadContent("elements/o-grid-home/grid-home.html")
    }
    onUnitLoad() {
        this.servers = this.element.querySelector("#servers")
        this.projects = this.element.querySelector("#projects")

        //When servers button is clicked, move to page
        this.servers.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveLeft()
        })
        //When projects button is clicked, move to page
        this.projects.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveRight()
        })

        //Opens about page via about icon
        let aboutMenu = new xel.Drawer()
        aboutMenu.setPosition("top")
        aboutMenu.drawer.innerHTML = '<o-about></o-about>'
        this.about = this.element.querySelector("#about")
        this.about.addEventListener("click", () => {
            aboutMenu.open()
        })
       
        //Opens about page via about icon
        let settingsMenu = new xel.Drawer()
        settingsMenu.setPosition("top")
        settingsMenu.drawer.innerHTML = '<o-settings></o-settings>'
        this.settings = this.element.querySelector("#settings")
        this.settings.addEventListener("click", () => {
            settingsMenu.open()
        })
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("HOME", "o-grid-home", Home)
    }
}

module.exports = Palette
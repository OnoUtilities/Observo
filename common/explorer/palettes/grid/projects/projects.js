class Projects extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-projects/grid-projects.shadow.html")
        this.loadContent("elements/o-grid-projects/grid-projects.html")
    }
    onUnitLoad() {
        //Projects page back button
        this.projectsBack = this.element.querySelector("#projectsBack")
        this.projectsBack.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveLeft()
        })
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("PROJECTS", "o-grid-projects", Projects)
    }
}

module.exports = Palette
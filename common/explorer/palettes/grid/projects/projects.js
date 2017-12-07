class Projects extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-projects/grid-projects.shadow.html")
        this.loadContent("elements/o-grid-projects/grid-projects.html")
    }
    onUnitLoad() {
        //Projects page back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveLeft()
        })
        this.addProject = this.element.querySelector("#addProject")
        this.addProject.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveDown()
        })
    }
}

class AddProject extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-add-project/grid-add-project.shadow.html")
        this.loadContent("elements/o-grid-add-project/grid-add-project.html")
    }
    onUnitLoad() {
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveUp()
        })
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("PROJECTS", "o-grid-projects", Projects)
        this.addBox("ADDPROJECT", "o-grid-add-project", AddProject)
    }
}

module.exports = Palette
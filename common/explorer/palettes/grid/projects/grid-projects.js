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
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveLeft()
        })
        this.addProject = this.element.querySelector("#addProject")
        this.addProject.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveDown()
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
        let projectName = document.getElementById('project-name').value // Variable for the text in the server name input box
        //getElementById stores the text in the input box in a variable
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        // Code for confirm button 
        this.test = this.element.querySelector('#confirm')
        this.test.addEventListener("click", () => {
            console.log("The server name is " + projectName)
           forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
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
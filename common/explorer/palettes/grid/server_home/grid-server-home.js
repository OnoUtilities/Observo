class Home extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-server-home/server-home.shadow.html") //NOT EMPTY
        this.loadContent("elements/o-grid-server-home/server-home.html")
    }
    onUnitLoad() {
        //Projects page back button
        this.disconnect = this.element.querySelector("#disconnect")
        this.disconnect.addEventListener("click", () => {
            prompt.show("Do you want to disconnect?", (state) => {
                if (state == true) {
                    forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1, 0, 0)
                }
            })
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
        this.loadBox("elements/o-grid-server-add-project/server-add-projects.shadow.html") //NOT EMPTY
        this.loadContent("elements/o-grid-server-add-project/server-add-projects.html")
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
        this.confirm = this.element.querySelector('#confirm')
        this.confirm.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SERVER-HOME", "o-grid-server-home", Home)
        this.addBox("SERVER-ADD-PROJECT", "o-grid-server-add-project", AddProject)
    }
}

module.exports = Palette
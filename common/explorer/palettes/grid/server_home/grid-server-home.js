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
                    PineApple.Stem.getStem("RUNTIME.EXPLORER", "PROJECT").close()
                    //PineApple.Stem.getStem("RUNTIME.EXPLORER", "USER").close()
                    forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1, 0, 0)
                }
            })
        })
        this.addProject = this.element.querySelector("#addProject")
        this.addProject.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveDown()
        })
        this.managePreset = this.element.querySelector("#managePreset")
        this.managePreset.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })


        this.sidebar = this.element.querySelector("o-sidebar").object
        this.slider = this.element.querySelector("x-slider")
        this.slider.addEventListener("change", () => {
            console.log("djkgfkjsdsdgjsdfjkgds")
            PineApple.Stem.getStem("RUNTIME.EXPLORER", "PROJECT").onSlide(this.slider.value)
        })
    }
    setSlider(value) {
        this.slider.value = value
    }
    clearProjects() {
        this.sidebar.element.querySelector("div").innerHTML = ""
    }
    add(name, preset) {
        this.sidebar.addItem(name, name, {
            "Preset": preset
        })
    }
}
class ManagePreset extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-server-manage-preset/server-manage-preset.shadow.html") //NOT EMPTY
        this.loadContent("elements/o-grid-server-manage-preset/server-manage-preset.html")
    }
    onUnitLoad() {
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveDown()
        })
        // Code for confirm button 
        this.confirm = this.element.querySelector('#confirm')
        this.confirm.addEventListener("click", () => {
           
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
        // Code for the back button
        this.back = this.element.querySelector("#back")
        this.back.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveUp()
        })
        // Code for confirm button 
        this.confirm = this.element.querySelector('#confirm')
        this.confirm.addEventListener("click", () => {
            PineApple.Stem.getStem("RUNTIME.EXPLORER", "PROJECT").addProject(this.element.querySelector("#project-name").value)
        })
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SERVER-HOME", "o-grid-server-home", Home)
        this.addBox("SERVER-ADD-PROJECT", "o-grid-server-add-project", AddProject)
        this.addBox("SERVER-MANAGE-PRESEt", "o-grid-server-manage-preset", ManagePreset)
    }
}

module.exports = Palette
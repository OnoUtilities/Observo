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
        console.log(name)
        this.sidebar.addItem(name, name, {
            "Preset": preset
        })
    }
    open(name, ip, uuid, sessionKey) {
        console.log(name)
        let me = this
        this.sidebar.addClick(name, () => {
            console.log("CLICKED")
            forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").showConnecting()
            forklift.App.getPaletteInstance("LOADER").getBoxObject("LOADER").show()
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").moveTo(-1,0, 0)
            me.connect(ip, uuid, sessionKey, name)
        })
    }
    connect(ip, uuid, sessionKey, project) {
        let mainWin = managerRemote.createWindow({
            show: false,
            width: 1000,
            height: 800,
            frame: false,
            color: "#000",
            webPreferences: {
                zoomFactor: 0.9,
            },
            icon: path.join(managerRemote.getDir(), 'assets/icons/png/1024x1024.png')
        })
        mainWin.setURL(managerRemote.getDir(), "project.html", {
            ip: ip,
            uuid: uuid,
            sessionKey: sessionKey,
            project: project
        })
        mainWin.win.setMinimumSize(800, 700);
        mainWin.win.webContents.on('did-finish-load', () => {
            mainWin.win.show()
            win.close();
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
            PineApple.Stem.getStem("RUNTIME.EXPLORER", "PROJECT").clonePreset(this.element.querySelector("#preset-url").value)
        })
        this.sidebar = this.element.querySelector("o-sidebar").object
    }
    clearProjects() {
        this.sidebar.element.querySelector("div").innerHTML = ""
    }
    add(name, server_version, client_version, color) {
        this.sidebar.addItem(name, name, {
            "Server": server_version,
            "Client": client_version,
        }, color)
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
        this.select = new xel.Select(this.element.querySelector("x-select"))
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SERVER-HOME", "o-grid-server-home", Home)
        this.addBox("SERVER-ADD-PROJECT", "o-grid-server-add-project", AddProject)
        this.addBox("SERVER-MANAGE-PRESET", "o-grid-server-manage-preset", ManagePreset)
    }
}

module.exports = Palette
//Spinner that appears when connecting to a server
class Loader extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-loader/loader.shadow.html") //NOT EMPTY
        this.loadContent("elements/o-loader/loader.html")
    }
    onContentLoad() {
        this.hide()
    }
    onUnitLoad() {
        this.spinner = this.element.shadow.querySelector("#spinner")
        this.x = this.element.shadow.querySelector("#x")
        this.title = this.element.shadow.querySelector("#title")

    }
    showConnecting() {
        this.x.style.display = "none"
        this.spinner.style.display = ""
        this.title.innerHTML = "Connecting..."
    }
    showError(text) {
        this.x.style.display = ""
        this.spinner.style.display = "none"
        this.title.innerHTML = text
    }
    hide() {
        this.element.style.display = "none"
    }
    show() {
        this.element.style.display = ""
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("LOADER", "o-loader", Loader)
    }
}
module.exports = Palette
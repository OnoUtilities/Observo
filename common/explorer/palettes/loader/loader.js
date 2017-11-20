class Loader extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-loader/loader.shadow.html")
        this.loadContent("elements/o-loader/loader.html")
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("LOADER", "o-loader", Loader)
    }
}
module.exports = Palette
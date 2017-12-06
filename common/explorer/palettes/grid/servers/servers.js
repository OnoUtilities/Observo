class Servers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-servers/grid-servers.shadow.html")
        this.loadContent("elements/o-grid-servers/grid-servers.html")
    }
    onUnitLoad() {
        this.serversBack = this.element.querySelector("#serversBack")
        this.serversBack.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveRight()
        })
        this.addServer = this.element.querySelector("#addServer")
        this.addServer.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveUp()
        })
    }
}


class AddServers extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-grid-servers/grid-servers.shadow.html")
        this.loadContent("elements/o-grid-servers/grid-servers.html")
    }
    onUnitLoad() {
        this.serversBack = this.element.querySelector("#serversBack")
        this.serversBack.addEventListener("click", () => {
            forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").moveDown()
        })
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SERVERS", "o-grid-servers", Servers)
    }
}

module.exports = Palette
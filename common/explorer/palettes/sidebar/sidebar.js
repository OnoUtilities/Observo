class Sidebar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
        this.items = {}
    }
    addItem(id, title, listDescriptions) {
        this.items[id] = {}
        this.element.querySelector("div").insertAdjacentHTML('beforeend', ` <x-box vertical class="box" id="${id}"></x-box>`)
        let boxes = this.element.querySelectorAll("x-box")
        let box = boxes[boxes.length - 1]

        box.insertAdjacentHTML('beforeend', `<x-label class="title"></x-label>`)
        let labels = this.element.querySelectorAll("x-label")
        let title = labels[labels.length - 1]
        title.innerHTML = title
        this.items[id]["title"] = title
        this.items[id]["description"] = listDescriptions

        for(let description in listDescription) {
            let value = listDescriptions[description]
            box.insertAdjacentHTML('beforeend', `<x-label class="text"><span class="bold">${description} : ${value} </span></x-label>`)
            labels = this.element.querySelectorAll("x-label")
            let location = labels[labels.length - 1]
            location.innerHTML = location.innerHTML + server.ip
        }
    }
    getEntry(id, entry) {
        if(this.items[id] != null) {
            if(this.items[id]["description"][entry] !=null) {
                return this.items[id]["desription"][entry]
            }
        }
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SIDEBAR", "o-sidebar", Sidebar)
    }
}
module.exports = Palette
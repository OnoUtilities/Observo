class Sidebar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox()
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
        let titleLabel = labels[labels.length - 1]
        titleLabel.innerHTML = title
        this.items[id]["title"] = title
        this.items[id]["description"] = listDescriptions
        this.items[id]["click"] = () => {}
        this.items[id]["context"] = () => {}

        let me = this

        for (let description in listDescriptions) {
            let value = listDescriptions[description]
            box.insertAdjacentHTML('beforeend', `<x-label class="text"><span class="bold">${description} : ${value} </span></x-label>`)
        }
        box.addEventListener("click", () => {
            me.items[id]["click"].call()
        })

        box.addEventListener("contextmenu", () => {
            me.items[id]["context"].call()
        })

    }
    removeItem(id) {
        if (this.element.querySelector(`#${id}`)  != null) {
            this.element.querySelector(`#${id}`).remove()
        }
        
    }
    addClick(id, callback) {
        if (this.items[id] != null) {
            this.items[id]["click"] = callback
        }
    }
    addContext(id, callback) {
        if (this.items[id] != null) {
            this.items[id]["context"] = callback
        }
    }
    getEntry(id, entry) {
        if (this.items[id] != null) {
            if (this.items[id]["description"][entry] != null) {
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
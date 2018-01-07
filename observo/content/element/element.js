
class CustomElement {
    constructor() {}
    createElement(element, instance) {
        let proto = Object.create(HTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    this.shadow = this.attachShadow({ mode: "closed" });      
                    this.object = instance
                    this.object.onCreate(this.shadow)
                }
            },
            attributeChangedCallback: {
                value: function (name, oldValue, newValue) {
                    this.object.onAttributeChange(name, oldValue, newValue)
                }
            }
        });
        document.registerElement(element, { prototype: proto });
    }  
}
class Handler {
    constructor() {
        
    }
    createElement(element) {
        $createElement(element, this)
    }
    onCreate(shadow) {

    }
    onAttributeChange(name, oldValue, newValue) {

    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: CustomElement,
    handler: Handler,
    enabled: true
})

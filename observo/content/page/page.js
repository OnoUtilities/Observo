class Page {
    constructor() {
       
    }
    loadPage() {
        
    }
}
class Handler {
    constructor() {
        
    }
    onCreate(shadow) {}
    onLoad() {}
    onSelect() {}
    onDeselect() {}
    onResize() {}
    onClose() {}
    onAttributeChange(name, oldValue, newValue) {}
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Page,
    handler: Handler,
    enabled: true
})

class Load {
    constructor() {
        this.locations = {}
    }
    loadStem(location, settings) {
        this.locations[location] = location
        PineApple.Core.useStem(location, settings)
    }
    loadChunk(name) {
        PineApple.Chunk.loadChunk(name)
    }
}
class Handler {
    constructor() { }
    loadStem(location, settings) {
        $loadStem(location, settings)
    }
}
PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Load,
    handler: Handler,
    enabled: true,
})

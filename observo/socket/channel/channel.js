class Channel {
    constructor() {
    }
    useChannel(self, ip, channel) {
        this._loadChannel(self, ip, channel)
    }
    _loadChannel(self, ip, channel) {
        console.log("NEW")
        let me = this
        console.log(channel)
        let socket = PineApple.Chunks.getInstance("OBSERVO.SOCKET")
        console.log(socket._io)
        let object = socket._io.connect(`${ip}${channel}`)
    
        //If server won't connect this event is thrown
        object.on('connect_error', function () {
            self.onError(object)
        })
        //If the client can connect run this event
        object.on('connect', function () {
            self.onConnect(object) 
            object.on('disconnect', function () {
                self.onDisconnect(object)
            })
        })
    }
}
class Handler {
    constructor() {}
    
    onConnect() { }
    onDisconnect() { }
    onError() {}

    useChannel(ip, channel) {
        this.ip = ip
        $useChannel(this, ip, channel)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Channel,
    handler: Handler,
    enabled: true,
})

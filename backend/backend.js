const API = 1

class SocketHandler {
    constructor() {
        var appServer = require('http').createServer(() => {})
        var io = require('socket.io')(appServer);
        var fs = require('fs');
        
        appServer.listen(80);
        var auth = io.of('/authenticate').on('connection', function (socket) {
                console.log("[Observo] Client Connected")
                socket.on("handshake", function (data) {
                    console.log("API: ", data.api)
                    if (data.api < API) {
                        socket.emit("close", {"reason": "Client API is too new!"})
                        console.log("Closed Client")
                        socket.disconnect()
                    } 
                    if (data.session != undefined) {
                        console.log("Session: " + data.authKey)
                    } else {
                        console.log("SIGNIN!")
                        socket.emit("verified", { invaild: true })
                    }
                })
                socket.on("authenticate", function (data) {
                    console.log(data)
                })
         });
    }
}


const socket = new SocketHandler()
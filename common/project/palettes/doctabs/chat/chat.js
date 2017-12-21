/**
 * TODO:
 * -Styling [Very important]
 * -Clean up code
 * -Make timestamps work after message cap as been reached
 * -Make messages load in groups of an undetermined number
 * -Get xel.Input updated so that it doesn't log an error message each time you press a key
 */
let moment = require("moment")
let messageCount = 0; //Change "0" to the total amount of messages from the database
let timestamps = []
class Chat extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-chat/o-chat.html")
        this.onDelete = () => { }
    }
    onContentLoad() {
        this.mainArea = this.element.querySelector("#chatItems")
        this.messageCutoff = 10; //Adjustable in preferances. Amount of messages to cut off at

        this.input = new xel.Input(this.element.querySelector("#chatInput"))
        this.input.input.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                this.placeMessage("http://via.placeholder.com/64x64", "testUser", messageCount, this.input.value) //Change to send message once database is complete
                this.input.clear()
            }
        }, true)

        this.send = new xel.Button(this.element.querySelector("#sendMessage"))
        this.send.onClick(() =>{
            this.placeMessage("http://via.placeholder.com/64x64", "testUser", messageCount, this.input.value) //Change to send message once database is complete
            this.input.clear()
        })
    }
    placeMessage(icon = "http://via.placeholder.com/64x64", username = "UNDEFINED", messageIndex, message) {
        if (messageIndex >= this.messageCutoff) {
            this.mainArea.removeChild(this.mainArea.querySelector("#message" + (messageIndex - this.messageCutoff)))
        }
        console.log(message + "\t[RECEIVED]")
        this.template = `<o-chat-item id="message${messageIndex}" message="${message}" user="${username}" icon="${icon}" timestamp="${moment().format()}"></o-chat-item>`
        this.mainArea.insertAdjacentHTML("beforeend", this.template)
    }
    onDelete(callback) {
        this.onDelete = callback
    }
}

class ChatItem extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-chat/o-chat-item.html")
    }
    onContentLoad() {
        console.log("CONTENT CALLED")
        this._icon = this.element.getAttribute("icon")
        this._id = this.element.id
        this._user = this.element.getAttribute("user")
        this._message = this.element.getAttribute("message")
        this._timestamp = this.element.getAttribute("timestamp")
        this.messageID = this.element.querySelector("#messageText")

        this.messageID.innerHTML = this._message
        timestamps.push(this.element.querySelector("#lifetime"))
        this.element.querySelector("#lifetime").setAttribute("timestamp", this._timestamp)
        this.element.querySelector("#avatar").setAttribute("src", this._icon)

        messageCount++  //Once message is sucessfully added, increase number of messages

        /*
        console.log(this._icon)
        console.log(this._id)
        console.log(this._user)
        console.log(this._message)
        console.log(this._timestamp)
        console.log(this.messageID)
        console.log(messageCount)
        */
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("CHAT", "o-chat", Chat)
        this.addBox("CHATITEM", "o-chat-item", ChatItem)
        setInterval(() => { //Starts an async task to change the times
            if (timestamps.length > 0) {
                for (let i = 0; i < messageCount; i++) {
                    //console.log("TIMESTAMP: " + i)
                    this.timestamp = timestamps[i].getAttribute("timestamp")
                    timestamps[i].innerHTML = moment(this.timestamp).fromNow()  //Sets the time to a statement regarding how long ago it was sent
                }
            }
        }, 60000)    //Rechecks every minute
    }
}

module.exports = Palette
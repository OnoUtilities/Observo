/**
 * TODO:
 * -Styling [Very important]
 * -Clean up code
 * -Make timestamps work after message cap as been reached
 * -Make messages load in groups of an undetermined number
 * -Get xel.Input updated so that it doesn't log an error message each time you press a key
 */

class Chat extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox()
        this.loadContent("elements/o-chat/o-chat.html")
    }
    onContentLoad() {
        this.mainArea = this.element.querySelector("#chatItems")
        this.messageCount = 0; //Change "0" to the total amount of messages from the database
        this.messageCutoff = 10; //Adjustable in preferances. Amount of messages to cut off at

        this.input = new xel.Input(this.element.querySelector("#chatInput"))
        this.input.input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.placeMessage("http://via.placeholder.com/64x64", "testUser", this.messageCount, this.input.value) //Change to send message once database is complete
                this.input.clear()
            }
        }, true)
    }
    placeMessage(icon = "http://via.placeholder.com/64x64", username = "UNDEFINED", messageIndex, message) {
        if (messageIndex >= this.messageCutoff) {
            this.mainArea.removeChild(this.mainArea.querySelector("#message" + (messageIndex - this.messageCutoff)))
        }
        console.log(message + "\t[RECEIVED]")
        this.template = `<o-chat-item id="message${messageIndex}" message="${message}" user="${username}" icon="${icon}"></o-chat-item>`
        this.mainArea.insertAdjacentHTML("beforeend", this.template)
        this.messageCount++
    }
}

class ChatItem extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-chat/o-chat-item.html")
        this.loadContent("elements/o-chat/o-chat-item.html")
    }
    onContentLoad() {
        console.log("CONTENT CALLED")
        this._icon = this.element.getAttribute("icon")
        this._user = this.element.getAttribute("user")
        this._message = this.element.getAttribute("message")
        this.messageID = this.element.querySelector("#messageText")

        this.messageID.innerHTML = this._message
        console.log(this._icon)
        console.log(this._message)
        console.log(this._user)
        console.log(this.messageID)

    }
}

class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("CHAT", "o-chat", Chat)
        this.addBox("CHATITEM", "o-chat-item", ChatItem)
    }
}

module.exports = Palette
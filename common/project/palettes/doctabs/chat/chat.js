/**
 * TODO:
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

        this.avatar = "" //Change to get the avatar of the user

        this.onDelete = () => {}
        this.onAvatarChange = () => {}
    }
    onContentLoad() {
        this.parentBox = this.element.querySelector("#chatCard")
        this.mainArea = this.element.querySelector("#chatItems")
        this.messageCutoff = 10; //Adjustable in preferances. Amount of messages to cut off at

        //this.mainArea.parentElement.addEventListener("scroll", this.loadOldMessages())

        this.input = new xel.Input(this.element.querySelector("#chatInput"))
        this.input.input.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                this.sendMessage()
            }
        }, true)

        this.send = new xel.Button(this.element.querySelector("#sendMessage"))
        this.send.onClick(() => {
            this.sendMessage()
        })
    }

    sendMessage() {
        //Something to emit that your message was sent
        this.placeMessage("http://via.placeholder.com/64x64", "testUser", 5678956789 , messageCount, "bottom", this.input.value) //Change to send message once database is complete
        this.input.clear()
    }

    receiveMessage() {
        //Test for message to be received from other person
        this.otherMessage = {
            "avatar": "http://via.placeholder.com/64x64",
            "username": "Joe Shmoe",
            "userID": "q4h3tg7h34iyhgiyukashbfyu4ouyfoadsfb",
            "messageID": "sfgsfvshsdbffdv",
            "message": "Hello, world!"
        }
        this.placeMessage(this.otherMessage.avatar, this.otherMessage.username, this.otherMessage.messageID, "bottom", this.otherMessage.message)
    }

    placeMessage(icon = "http://via.placeholder.com/64x64", username = "UNDEFINED", userID, messageID, position = "bottom", message) {
        //this.mainArea.removeChild(this.mainArea.querySelector("#message" + (messageIndex - this.messageCutoff)))  //Code fragment for removing the oldest displayed message
        console.log(message + "\t[RECEIVED]")
        this.template = `<o-chat-item id="message${messageID}" message="${message}" user="${username}" userID="${userID}" icon="${icon}" timestamp="${moment().format()}"></o-chat-item>`

        this.mainArea.insertAdjacentHTML("beforeend", this.template)
    }

    loadOldMessages() {
        if (this.mainArea.parentElement.scrollTop <= 0) {   //Replace this code with something to load messages from the database
            for (var i = -1; i > -11; i--) {    //Must be loaded backwards (i is negative) as of now so that it is displayed first
                this.placeMessage("http://via.placeholder.com/64x64", "OLDUser", i, "Testnuggets " + i)
            }
        }
    }
    onAvatarChange(username, avatar) {
        //Something that goes through each message and if the IDs match, change the avatar
        for(var message in document.getElementsByName(username)){
            console.log(message)
            console.log(avatar)
            message.querySelector("#avatar").setAttribute("src", "data:image/jpeg;base64," + avatar) //Assumes avatar given is in base64
        }
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
        this.message = this.element.querySelector("#messageText")
        this._icon = this.element.getAttribute("icon")
        this._id = this.element.id
        this._user = this.element.getAttribute("user")
        this.userID = this.element.getAttribute("userID")
        this._message = this.element.getAttribute("message")
        this._timestamp = this.element.getAttribute("timestamp")
        
        //Message action buttons
        this.editButton = this.element.querySelector("#editMessage")
        this.deleteButton = this.element.querySelector("#deleteMessage")

        this.message.innerHTML = this._message
        timestamps.push(this.element.querySelector("#lifetime"))
        this.element.querySelector("#lifetime").setAttribute("timestamp", this._timestamp)
        this.element.querySelector("#lifetime").setAttribute("name", this._user)
        this.element.querySelector("#lifetime").innerHTML = this._user + " - A few seconds ago..." //If this isn
        this.element.querySelector("#avatar").setAttribute("src", this._icon)

        this.deleteButton.addEventListener("click", () => {
            console.log("DELETED")
        })
        this.editButton.addEventListener("click", () => {
            //Something to change the X-label into a x-input and select it, making it so that the aciton is canceled on click off
            console.log("EDITED")
        })

        messageCount++ //Once message is sucessfully added, increase number of messages

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
                    this.username = timestamps[i].getAttribute("name")
                    timestamps[i].innerHTML = this.username + " - " + moment(this.timestamp).fromNow() //Sets the time to a statement regarding how long ago it was sent
                }
            }
        }, 60000) //Rechecks every minute
    }
}

module.exports = Palette
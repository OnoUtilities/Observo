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
        //UNCOMMENT FOR TIME COUNTERS BY MINUTE
        /*
                setInterval(() => {
                    for (var i = 0; i < this.messageCount; i++) {
                        this.timer = this.mainArea.querySelector("#messageTimer" + i)
                        console.log(this.timer + "   " + "#messageTimer" + i)
                        this.timer.setAttribute("lifetime", (parseInt(this.timer.getAttribute("lifetime")) + 1))
                        this.timer.textContent = this.timer.getAttribute("lifetime")
                    }
                }, 60000)
                */
    }
    placeMessage(icon = "http://via.placeholder.com/64x64", username = "UNDEFINED", messageIndex, message) {
        if (messageIndex >= this.messageCutoff) {
            this.mainArea.removeChild(this.mainArea.querySelector("#message" + (messageIndex - this.messageCutoff)))
        }
        console.log(message + "\t[RECEIVED]")
        this.template =
            `
        <o-box flex row id="message${messageIndex}" style="background-color: white" class="chatItem right">
        <o-box flex column class="img">
            <o-box flex style="flex: 0 0 auto; height: 64px;">
                <img src="${icon}" />
            </o-box>
            <o-box flex></o-box>
        </o-box>
        <o-box flex column class="message">
            <o-box flex class="text">
                <x-label>${message}</x-label>
            </o-box>
            <o-box flex class="user">
                <x-label>${username} - <span lifetime="0" id="messageTimer${messageIndex}">>1</span> minutes ago</x-label>
            </o-box>
        </o-box>
    </o-box>
        `
        this.mainArea.insertAdjacentHTML("beforeend", this.template)
        this.messageCount++
    }
}

class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("CHAT", "o-chat", Chat)
    }
}

module.exports = Palette
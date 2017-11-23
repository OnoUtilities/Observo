/**
 * MAIN Palette - Commonly used Box Elements
 */
class MenuBar extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-menubar/menubar.shadow.html")
        this.loadContent("elements/o-menubar/menubar.html")
    }
    onContentLoad() {
        let data = managerLocal.parseArgs()

        this.title_menubar = new xel.TitleMenubar(data.id, "#menubar")
        this.title_menubar.addClose()
        this.title_menubar.addMinimize()
        this.title_menubar.addZoom()
        this.title_menubar.build()
    }
}

class DocTabs extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-doctabs/doctabs.shadow.html")
        this.loadContent("elements/o-doctabs/doctabs.html")
    }
}

class Loader extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-loader/loader.shadow.html")
        this.loadContent()
    }
}

class Box extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-box/box.shadow.html")
        this.loadContent()
    }
}

class Prefrences extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-prefrences/prefrences.shadow.html")
        this.loadContent("elements/o-prefrences/prefrences.html")
    }
}

class PrefrencesHandler {
    constructor(p) {
        drawer.drawer.innerHTML = '<o-prefrences></o-prefrences>'
        this.prefrenceButton = new xel.MenuItem("#file-prefrences")
        this.prefrenceButton.onClick(() => {
            console.log("Got here")
            drawer.open()
        })
    }
}

class Connect extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-connect/connect.shadow.html")
        this.loadContent("elements/o-connect/connect.html")
    }
}

class ConnectHandler {
    constructor(p) {
        prompt.drawer.innerHTML = '<o-connect></o-connect>'

        this.connectMenuButton = new xel.MenuItem("#connect")
        this.connectMenuButton.onClick(() => {
            prompt.open()
        })
        var connectButton = document.querySelector("#cancel");
        connectButton.addEventListener("click", () => {
            prompt.close()
        })
    }
}

/*class Refresh extends forklift.PaletteBox {
    constructor(p){
        super(p)
        this.refreshServer = new xel.MenuItem("#refresh-server")
        this.refreshServer.onClick(() => {
            this.loadBox("elements/o-refresh/refresh.shadow.html")
            this.loadContent("elements/o-refresh/refresh.html")
        })
        
    }
}*/
//Doesn't Work
//Bruce Needs to fix this
//Help Would be nice :P

class Help extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-help/help.shadow.html")
        this.loadContent("elements/o-help/help.html")
    }
}

class HelpHandler {
    constructor(p){
        let helpMenu = new xel.Dialog()
        helpMenu.dialog.innerHTML = '<o-help></o-help>'
        this.help = new xel.MenuItem("#help")
        this.help.onClick(() => {
            helpMenu.dialog()
        })
    }
}

class Content extends forklift.PaletteBox {
    constructor(p) {
        super(p)
        this.loadBox("elements/o-content/content.shadow.html")
        this.loadContent("elements/o-content/content.html")
    }
    onUnitLoad() {
        let me = this
        this.prefrences = new PrefrencesHandler(me)
        this.connectionInfo = new ConnectHandler(me)
        this.helpInfo = new HelpHandler(me)
    }
}


class Palette extends forklift.PaletteLoader {
    constructor(p) {
        super(p)
        this.addBox("MENUBAR", "o-menubar", MenuBar)
        this.addBox("DOCTABS", "o-doctabs", DocTabs)
        this.addBox("LOADING", "o-loader", Loader)
        this.addBox("BOX", "o-box", Box)
        this.addBox("CONTENT", "o-content", Content)
        this.addBox("PREFRENCES", "o-prefrences", Prefrences)
        this.addBox("CONNECT", "o-connect", Connect)
        //this.addBox("REFRESH", "o-refresh", Refresh)
        this.addBox("HELP", "o-help", Help)
    }
}

module.exports = Palette //needed to work
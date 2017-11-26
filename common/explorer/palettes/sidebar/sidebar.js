class Sidebar extends forklift.PaletteBox {
    constructor(e) {
        super(e)
        this.loadBox("elements/o-sidebar/sidebar.shadow.html")
        this.loadContent("elements/o-sidebar/sidebar.html")
    }
    onContentLoad() {
        let me = this
        let servers = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").storage.getServers()
        console.log(forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").storage)
        for (var key in servers) {
            console.log("KEY:" + key)
            if (servers.hasOwnProperty(key)) {
                let server = servers[key];
                this.element.insertAdjacentHTML('beforeend', ` <x-box vertical class="box"></x-box>`)
                let boxes = this.element.querySelectorAll("x-box");
                let box = boxes[boxes.length - 1];

                box.insertAdjacentHTML('beforeend', `<x-label class="title"></x-label>`)
                let labels = this.element.querySelectorAll("x-label");
                let title = labels[labels.length - 1];
                title.innerHTML = title.innerHTML = server.name;
                box.insertAdjacentHTML('beforeend', `<x-label class="text"><span class="bold">Address: </span></x-label>`)
                labels = this.element.querySelectorAll("x-label");
                let location = labels[labels.length - 1];
                location.innerHTML = location.innerHTML + server.ip


                box.addEventListener("click", function () {
                    me.autheticate(server.ip)
                })
            }
        }
        //let addServerButton = //Planning to move "Add Server" button to sidebar
    }
    autheticate(ip) {
        let auth = io.connect(`${ip}authenticate`) 
        auth.on('connect', function () {
              /* JSON 

                api: API - passes API (from explorer.html) to server
                *authKey: <server authkey>* - a auth keep if remember me is enabled, regenerated each time on signin

              */
              auth.emit("handshake", { api: API })  //Emit API (and optional authKey) via the handshake EVENT to the server

              //On close event, used if API is out of date or other CLOSING needs
              auth.on("close", (data) => {
                  alert(data)
              }) 
              //Used my authetication key is good or
              //This opens the connect box from MAIN palette in Box called contents. Then it used the local instance of class to run a method call open()
              let connect = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENTS").connect
              auth.on("verified", (data) => {
                if (data.invaild == true) {
                    //Invaild session key tell client to open USER CONNECT BOX
                    let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
                    content.style.display = "none"
                    connect.open(()=>{
                        connect.onConnect(() => {
                            console.log(connect.getUsername())
                            console.log(connect.getPassword())
                            auth.emit("authenticate", { username: connect.getUsername(), password: connect.getPassword() })
                        })
                        connect.onCancel(() => {
                            let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
                            content.style.display = ""
                            connect.close()
                        });
                    })
                } else {
                    //pass login to server with data.sessionKey
                }
              }) 
        });
    }
    connect(ip) {
        let mainWin = managerRemote.createWindow({
            show: false,
            width: 1000,
            height: 800,
            frame: false,
            color: "#000",
            webPreferences: {
               zoomFactor: 0.9,
             },
            icon: path.join(managerRemote.getDir(), 'assets/icons/png/1024x1024.png')})
          mainWin.setURL(managerRemote.getDir(),"project.html", {server_ip: ip})
          mainWin.win.setMinimumSize(800,700);
          mainWin.win.webContents.on('did-finish-load', () => {
            mainWin.win.show()
            win.close();
          })
          let content = forklift.App.getPaletteInstance("MAIN").getBox("CONTENTS")
          content.style.display = "none"
    }
}
class Palette extends forklift.PaletteLoader {
    constructor(id) {
        super(id)
        this.addBox("SIDEBAR", "o-sidebar", Sidebar)
    }
}
module.exports = Palette
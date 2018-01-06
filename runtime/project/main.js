import "Observo.File"
import "Observo.Load"

export class Preset extends Observo.File {
        constructor() {
            super()   
            this.list = {}
            this.presets = {}
        }    
        load() {
            let me = this
            console.log("RUNNING")
            let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
            this.makeDirectory(location, () => {
                me.reloadPresets()
            })    
        }
        reloadPresets() {
            let location = forklift.App.getPaletteInstance("MAIN").getBoxObject("CONTENT").config.presets
            this.presets = this.walkDirectory(location, "manifest.json")
            console.print(this.presets)
            this.checkPreset()
        }
        checkPreset() {
            for (let preset in this.presets) {
                console.log(preset)
                this.parse(this.presets[preset])
            }   
        }
        parse(data) {
            console.print(data)
            let folder = this.replaceAll(data, "manifest.json", "")
            let json = this.read(data)
            json = JSON.parse(json)
            if (json.PAPI = 1 && json.name != null) {
                this.list[json.id] = json
                this.list[json.id].folder = folder
            }
        }
        replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'ig'), replace)
        }
        getList() {
            return this.list
        }
    }
export class Load extends Observo.Load {
    constructor() {
        super()
    }
    load(location) {
        this.loadStem(location, {
            permissions: ["OBSERVO.CONTENT"],
            vm: {
                console: 'inherit',
                sandbox: {
                    setTimeout,
                }
            },
            base: true
        })
    }
}

export class Main {
    constructor() {

    }
    run(args) {
        console.print(args)
        let load = use("RUNTIME.PROJECT")["LOAD"]
        let presets = use("RUNTIME.PROJECT")["PRESET"]
        presets.reloadPresets()
        for (let p in presets.list) {
            console.log(p)
            console.print(presets.list[p].folder)
            if (p == args.preset) {
                load.load(presets.list[p].folder)
            }
        }
    }
    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'ig'), replace)
    }
}
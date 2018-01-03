
const fs = require("fs")


const walkSync = function (dir, filelist, filename=null) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist, filename);
        }
        else {
            if (filename != null) {
                if (file == filename) {
                    filelist.push(path.join(dir, file));
                }
            } else {
                if (file.split(".")[1] == "json") {
                    filelist.push(path.join(dir, file));
                }
            }

        }
    });
    return filelist;
};




class Files {
    constructor() {
        this.pages = {}
        console.log("File System Working")
    }
    walkDirectory(directory, filename) {
        let walk = walkSync(directory, [], filename)
        return walk
    }
    makeDirectory(directory, callback) {
        fs.mkdir(directory, callback) 
    }
    read(file) {
        return fs.readFileSync(file, 'utf8');
    }
}
class Handler {
    constructor() { }

    walkDirectory(directory, filename= null) {
        return $walkDirectory(directory, filename)
    }
    makeDirectory(directory, callback) {
        $makeDirectory(directory, callback)
    }
    read(file) {
        return $read(file)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Files,
    handler: Handler,
    enabled: true,
})

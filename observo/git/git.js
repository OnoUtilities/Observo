const ghdownload = require('github-download')
const path = require('path')
class Git {
    constructor() {
      this.pages = {}
    }
    downloadFile(url, location, callback) {
      
      console.log(location)
        ghdownload(url, location)
        .on('dir', function(dir) {
          
        })
        .on('file', function(file) {
          
        })
        .on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
          
        })
        .on('error', function(err) {
          callback(err)
        })
        .on('end', function() {
          callback(true)
        })
    }
}
class Handler {
    constructor() {}

    downloadFile(url, location, callback) {
        $downloadFile(url, location, callback)
    }
}

PineApple.Chunks.add({
    chunk: Chunk,
    runtime: Git,
    handler: Handler,
    enabled: true,
})

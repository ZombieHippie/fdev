#!/usr/bin/env node
var fs = require('fs')
  , http = require('http')
  , jade = require('jade')
  , static = require('node-static')
  , pathUtil =require('path')
  , jadeRe = /\.jade$/
  , fileRe = /\.\w+$/
  , fileServed = process.argv.slice(2)[0]
  , path = process.argv.slice(2)[1]
  , port = parseInt(process.argv.slice(2)[2]) || 8080
  , fileServer = new static.Server(path || '.')

if (path)
  process.chdir(pathUtil.resolve(path));

var fContents;
if (!fileServed)
  return console.error("insufficient arguments", "expected:", process.argv.join(" ") + " <filename>")
else {
  if (jadeRe.test(fileServed))
    fContents = jade.renderFile('.' + req.url, {
        filename: '.' + fileServed.replace(jadeRe, ''),
        pretty: true
      })
  else
    fContents = fs.readFileSync(fileServed, "utf8")
}

http.createServer(function (req, res) {
  if (req.url.match(jadeRe)) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    try {
      res.end(jade.renderFile('.' + req.url, {
        filename: '.' + req.url.replace(jadeRe, ''),
        pretty: true
      }))
    } catch (parseError) {
      res.end('<pre>' + parseError + '</pre>')
    }
  } else if (req.url.match(fileRe)) {
    req.addListener('end', function () {
      fileServer.serve(req, res)
    }).resume()
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'})
	res.end(fContents);
  }
}).listen(port)

console.log("server runnning on localhost:" + port)

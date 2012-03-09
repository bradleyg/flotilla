var seaport = require('seaport');
var http = require('http');
var pkg = require('./package.json');

var ports = seaport.connect('localhost', 6000);

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

ports.service(pkg.name + '@' + pkg.version, function (port, ready) {
  server.listen(port, ready);
});
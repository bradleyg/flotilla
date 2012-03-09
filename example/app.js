var seaport = require('seaport');
var ports = seaport.connect('localhost', 6000);
var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

ports.service('webservice@1.2.3', function (port, ready) {
  server.listen(port, ready);
});
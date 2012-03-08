// modules
var seaport = require('seaport');
var bouncy = require('bouncy');

// start the proxy
module.exports.start = function(opts) {
  
  // seaport server
  var ports = seaport.createServer().listen(opts.seaPort);

  // proxy server
  bouncy(function (req, bounce) {
      var host = req.headers.host.split(':')[0];
      var ps = ports.query(host);

      if (ps.length === 0) {
          var res = bounce.respond();
          res.end('service not available\n');
      }
      else {
          bounce(ps[0].host, ps[0].port);
      }
  }).listen(opts.proxyPort);  
    
}
// config
var proxyPort = 5000;
var seaPort = 6000;
var hubPort = 7000;
var secret = 'beepboop';
var hubDir = __dirname + '/hub';
var droneDir = __dirname + '/drone';

// modules
var spawn = require('child_process').spawn;
var seaport = require('seaport');
var bouncy = require('bouncy');
var winston = require('winston');

// logs
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({colorize: true}),
    new (winston.transports.File)({filename: __dirname + '/fleeted.log', timestamp: true})
  ]
});

// spawn args
var args = {
  hub: [
    '--basedir=' + hubDir, 
    '--port=' + hubPort, 
    '--secret=' + secret
  ],
  drone: [
    '--basedir=' + droneDir, 
    '--hub=localhost:' + hubPort, 
    '--secret=' + secret
  ]
}

// spawn the fleet commands
var spawnFleet = function(type) {
  var child = spawn(__dirname + '/node_modules/fleet/bin/' + type + '.js', args[type]);  
  
  child.stdout.on('data', function (data) {
    log.warn(type + ' - ' + trim(data));
  });
  
  child.stderr.on('data', function (data) {
    log.error(type + ' - ' + trim(data));
  });
  
  child.on('exit', function (code) {
    log.error(type + ' - exited');
  });
}

// seaport server
var ports = seaport.createServer().listen(seaPort);

// proxy server
var createProxy = function() {
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
  }).listen(proxyPort);  
}

// helper functions
var trim = function(string) {
  return string.toString().replace(/(\r\n|\n|\r)/gm,"");
}

spawnFleet('hub');
spawnFleet('drone');
createProxy();

log.info('-----------------------------');
log.info('Bouncy proxy running on port ' + proxyPort);
log.info('Seaport running on port ' + seaPort);
log.info('Hub running on port ' + hubPort);
log.info('Propagit running on port ' + (hubPort + 1));
log.info('Drone running');
log.info('-----------------------------');
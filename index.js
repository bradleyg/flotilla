// config
var hubDir = 'flotilla/hub';
var droneDir = 'flotilla/drone';
var logFile = 'flotilla/flotilla.log';

// modules
var spawn = require('child_process').spawn;
var seaport = require('seaport');
var bouncy = require('bouncy');
var winston = require('winston');
var mkdirp = require('mkdirp');

// log setup
var consoleTrans = new winston.transports.Console({colorize: true});
var winTrans = new winston.transports.File({filename: logFile, timestamp: true});
var log = new winston.Logger({transports: [consoleTrans, winTrans]});

// create a dir to work from
mkdirp.sync('flotilla');

// args
var argv = require('optimist')
  .usage('Usage: flotilla --proxyPort=8000 --hubPort=7000 --seaPort=6000 --secret=beepboop')
  .demand(['proxyPort', 'hubPort', 'seaPort', 'secret'])
  .argv;

// spawn args
var args = {
  hub: [
    '--basedir=' + hubDir, 
    '--port=' + argv.hubPort, 
    '--secret=' + argv.secret
  ],
  drone: [
    '--basedir=' + droneDir, 
    '--hub=localhost:' + argv.hubPort, 
    '--secret=' + argv.secret
  ]
}

// helpers
var trim = function(string) {
  return string.toString().replace(/(\r\n|\n|\r)/gm,"");
}

// spawn the fleet servers
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
var ports = seaport.createServer().listen(argv.seaPort);

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
  }).listen(argv.proxyPort);  
}

spawnFleet('hub');
spawnFleet('drone');
createProxy();

log.info('-----------------------------');
log.info('Bouncy proxy running on port ' + argv.proxyPort);
log.info('Seaport running on port ' + argv.seaPort);
log.info('Hub running on port ' + argv.hubPort);
log.info('Propagit running on port ' + (argv.hubPort + 1));
log.info('Drone running');
log.info('-----------------------------');
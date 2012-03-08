// modules
var spawn = require('child_process').spawn;
var path = require('path');

// my modules
var logger = require('./logger');

// start the fleet servers
module.exports.start = function(opts, type){
  
  // create logger
  var log = logger.create(opts);
  
  // spawn args
  var args = {
    hub: [
      '--basedir=' + opts.dir + '/hub', 
      '--port=' + opts.hubPort, 
      '--secret=' + opts.secret
    ],
    drone: [
      '--basedir=' + opts.dir + '/drone', 
      '--hub=localhost:' + opts.hubPort, 
      '--secret=' + opts.secret
    ]
  }
  
  // spawn the fleet servers  
  var fleetPath = path.resolve(__dirname + '/../node_modules/fleet/bin/' + type + '.js');
  var child = spawn(fleetPath, args[type]);  

  child.stdout.on('data', function (data) {
    log.warn(type + ' - ' + trim(data));
  });

  child.stderr.on('data', function (data) {
    log.error(type + ' - ' + trim(data));
  });

  child.on('exit', function (code) {
    log.error(type + ' - exited');
  });
  
  var trim = function(string) {
    return string.toString().replace(/(\r\n|\n|\r)/gm,"");
  }
  
}
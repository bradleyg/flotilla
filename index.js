// my modules
var options = require('./lib/options');
var proxy = require('./lib/proxy');
var fleet = require('./lib/fleet');
var logger = require('./lib/logger');

// args
var opts = options.get();

// create logger
var log = logger.create(opts);

// start the proxy
proxy.start(opts);

// start fleet
fleet.start(opts, 'hub');
fleet.start(opts, 'drone');

log.info('-----------------------------');
log.info('Bouncy proxy running on port ' + opts.proxyPort);
log.info('Seaport running on port ' + opts.seaPort);
log.info('Hub running on port ' + opts.hubPort);
log.info('Propagit running on port ' + (opts.hubPort + 1));
log.info('Drone running');
log.info('-----------------------------');
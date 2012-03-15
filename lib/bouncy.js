// modules
var seaport = require('seaport');
var bouncy = require('bouncy');
var fs = require('fs');
var path = require('path');
var dnode = require('dnode');
var logger = require('../lib/logger');

// start the proxy
module.exports.start = function(opts) {
  
  // create logger
  var log = logger.create(opts);
  
  // seaport server
  var ports = seaport.createServer().listen(opts.seaPort);
  
  // write blank proxy if needed
  var tablePath = opts.dir + '/proxy.json';
  if( ! path.existsSync(tablePath)){
    fs.writeFileSync(tablePath, JSON.stringify({}));
  }
  
  // read current proxy table
  var table = JSON.parse(fs.readFileSync(tablePath));
  
  // proxy request
  bouncy(function (req, bounce) {
    
    var domain = (typeof req.headers.host !== 'undefined') ? req.headers.host.split(':')[0].replace('www.', '') : false;
    
    if(table[domain]){
      var service = table[domain];
      var ps = ports.query(service);
      
      if (ps.length !== 0) {
        var random = Math.floor(Math.random() * ps.length);
        return bounce(ps[random].host, ps[random].port);
      }
    }
    
    var res = bounce.respond();
    res.end('service not available\n');
    
  }).listen(opts.proxyPort);  
  
  // dnode update proxy server
  var proxyUpdater = dnode({ 
    update: function (cmd, argv, cb) {
      // type of update
      switch(cmd) {
        case 'add': table[argv.domain] = argv.service; break;
        case 'rm': delete table[argv.domain]; break;
        default: return cb(table); break;
      }
    
      // write the file if we need to
      fs.writeFile(tablePath, JSON.stringify(table, undefined, 2), function(err){
        log.info('Proxy table updated');
        log.info(JSON.stringify(table, undefined, 2));
        cb(table);  
      });
    }
  }).listen(5000);
  
}
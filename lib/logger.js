// modules
var winston = require('winston');

module.exports.create = function(opts) {
  
  // logger
  var consoleTrans = new winston.transports.Console({colorize: true});
  var winTrans = new winston.transports.File({filename: opts.dir + '/flotilla.log', timestamp: true});
  var logger = new winston.Logger({transports: [consoleTrans, winTrans]});
  
  return logger;
  
}
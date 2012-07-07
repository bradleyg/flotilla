// modules
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var optimist = require('optimist');

module.exports.get = function () {

  // setup arg requirements
  var usage = 'Usage: flotilla start --proxyPort=8000 --hubPort=7000 --seaPort=6000 --secret=keyboardmouse --dir=flotilla';
  var demand = ['proxyPort', 'hubPort', 'seaPort', 'secret', 'dir'];
  
  // check to see if we already have a options file
  var options = fs.existsSync('flotilla.json') ? JSON.parse(fs.readFileSync('flotilla.json')) : false;

  // we already have a working dir, remove the demand
  if(options) demand.pop();
  
  // if we have args or no save options
  if(process.argv.length > 2 || ! options){
    
    var args = optimist.usage(usage).demand(demand).argv;
    
    // if we have already have a working dir
    args.dir = (options) ? options.dir : process.cwd() + '/' + args.dir;
    
    // make dir and write/overwrite file
    mkdirp.sync(args.dir);
    fs.writeFileSync(args.dir + '/flotilla.json', JSON.stringify(args, undefined, 2) + '\n');
    
    return args;
  }
  
  return options;
};
#!/usr/bin/env node

// modules
var dnode = require('dnode');

var usage = 'Usage:\n  flotilla proxy add --domain=example.com --version=example@1.2.3\n  flotilla proxy rm --domain=example.com\n  flotilla proxy ls';
            
var cmd = process.argv[2] || null;

// required args
var demand = {
  add: ['domain', 'version'],
  rm: ['domain'],
  ls: []
}

// required commands
if( ! demand[cmd]) {
  console.log(usage);
  process.exit();
}

// args
var argv = require('optimist').usage(usage).demand(demand[cmd]).argv;
delete argv._;
delete argv['$0'];

// connect to the proxy server
dnode.connect(5000, function (remote) {
  // run the remote command
  remote.update(cmd, argv, function(message) {
    console.log('\n\ninfo: Request successful\ninfo: ' + JSON.stringify(message, undefined, 2) + '\n');
    process.exit();  
  });
});


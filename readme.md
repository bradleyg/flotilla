[![build status](https://secure.travis-ci.org/bradleyg/flotilla.png)](http://travis-ci.org/bradleyg/flotilla)
_Continuous deployment with a HTTP host router, basically a wrapper for Bouncy/Fleet/Seaport by [@substack](https://github.com/substack). Currently doesn't support one of the best features of fleet/propagit - multiple drones._  

###On the server:  
Install ```flotilla```:   
```$ [sudo] npm install -g flotilla```  

From a folder where you want ```flotilla``` to live, start with options (to start on any privileged ports you may need SUDO):  
```$ flotilla start --proxyPort=8000 --hubPort=7000 --seaPort=6000 --secret=keyboardmouse --dir=flotilla```  

This will create a folder in the current directory name via the ```--dir``` option which will contain the hub, drone and logfile and also starts the services required for ```flotilla```.  

If you have already run ```flotilla``` before, you can start it again from within the created folder with no options (options are saved on first run, to overwrite just pass the options again).
```$ flotilla start```

###Local machine - install [fleet](https://github.com/substack/fleet) by [@substack](https://github.com/substack):
```$ [sudo] npm install -g fleet```  

Add a new remote to an existing git repo (use the app.js example, switch ```SERVER_IP``` for yours):  
```$ fleet remote add default --hub=SERVER_IP:7000 --secret=keyboardmouse``` (hubPort=7000)  

Deploy:  
```$ fleet deploy```  

Spawn a process:  
```$ fleet spawn -- node app.js```  

Glue a domain to a version:  
```$ fleet exec -- flotilla proxy add --domain=example.com --version=example@1.0.x```  

Test (switch ```SERVER_IP``` for yours):  
```$ curl -H host:example.com SERVER_IP:8000``` (proxyPort=8000)  

You can find more ```fleet``` commands [here](https://github.com/substack/fleet).  
  
###Commands:
```flotilla start --proxyPort=PORT --hubPort=PORT --seaPort=PORT --secret=SECRET --dir=DIR_NAME```
```flotilla proxy add --domain=DOMAIN --version=VERSION```  
```flotilla proxy rm --domain=DOMAIN```  
```flotilla proxy ls```

###Example App:
```javascript
// package.json
{
  "name": "example",
  "version": "1.0.1",
  "dependencies": {
    "seaport": "0.6.0"
  }
}
```
  
```javascript
// app.js
var seaport = require('seaport');
var http = require('http');
var pkg = require('./package.json');

var ports = seaport.connect('localhost', 6000);

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

ports.service(pkg.name + '@' + pkg.version, function (port, ready) {
  server.listen(port, ready);
});
```
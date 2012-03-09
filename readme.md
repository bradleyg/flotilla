_Continuous deployment with a HTTP host router, basically a wrapper for Bouncy/Fleet/Seaport by [@substack](https://github.com/substack). Currently doesn't support one of the best features of fleet/propagit - multiple drones._  

###On the server:  
Install ```flotilla```:   
```$ [sudo] npm install -g flotilla```  

From a folder where you want ```flotilla``` to live, start with options (to start on any privileged ports you may need SUDO):  
```$ flotilla --proxyPort=8000 --hubPort=7000 --seaPort=6000 --secret=beepboop --dir=flotilla```  

This will create a folder in the current directory name via the ```--dir``` option which will contain the hub, drone and logfile and also starts the services required for ```flotilla```.  

If you have already run ```flotilla``` before, you can start it again from within the created folder with no options (options are saved on first run, to overwrite just pass the options again).  
```$ flotilla```

###Local machine - install [fleet](https://github.com/substack/fleet) by [@substack](https://github.com/substack):
```$ [sudo] npm install -g fleet```  

Add a new remote to a git repo (use the app.js example, switch ```SERVER_IP``` for yours):  
```$ fleet remote add default --hub=SERVER_IP:7000 --secret=beepboop``` (hubPort=7000)  

Deploy:  
```$ fleet deploy```  

Spawn a process:  
```$ fleet spawn -- node app.js```  

Glue a domain to a service:  
```$ fleet exec -- flotilla proxy add --domain=example.com --service=webservice@1.2.3```  

Test (switch ```SERVER_IP``` for yours):  
```$ curl -H host:example.com SERVER_IP:8000``` (proxyPort=8000)  

You can find more ```fleet``` commands [here](https://github.com/substack/fleet).  

###Example App:
```javascript
var seaport = require('seaport');
var ports = seaport.connect('localhost', 6000); // (seaPort=6000)
var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

ports.service('webservice@1.2.3', function (port, ready) { // use the domain name you want to deploy, will have to be pointed at your server
  server.listen(port, ready);
});
```
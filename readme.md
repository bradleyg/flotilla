_Continuous deployment with a HTTP host router, basically a wrapper for Bouncy/Fleet/Seaport by [@substack](https://github.com/substack). Currently doesn't support one of the best features of fleet/propagit - multiple drones._  
  
###On the server:
Make sure ports 5000, 7000, 7001 are open.  
```npm install fleeted```  
```node ./node_modules/fleeted/index.js```  

###Local machine - install [fleet](https://github.com/substack/fleet) by [@substack](https://github.com/substack):
```[sudo] npm install -g fleet```  
 
Add a new remote to a git repo (use the app.js example, switch ```SERVER_IP``` for yours):  
```fleet remote add default --hub=SERVER_IP:7000 --secret=beepboop```

Deploy:  
```fleet deploy```  

Spawn a process:  
```fleet spawn -- node app.js```  

Test (switch ```SERVER_IP``` for yours):  
```curl -H host:example.com SERVER_IP:5000```

You can find more ```fleet``` commands [here](https://github.com/substack/fleet).  

###Example App:
```javascript
var seaport = require('seaport');
var ports = seaport.connect('localhost', 6000); // fleeted starts seaport on port 6000
var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
})

ports.service('example.com', function (port, ready) { // use the domain name you want to deploy, will have to be pointed at your server
  server.listen(port, ready);
});
```

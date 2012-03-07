_Continuous deployment with a HTTP host router, basically a wrapper for Bouncy/Fleet/Seaport by [@substack](https://github.com/substack)._  
  
Switch out ```example.com``` for your domain.  

###On the server:
Make sure ports 5000, 7000, 7001 are open.  
```npm install fleeted```  
```node ./node_modules/fleeted/index.js```  

  
###Local machine - install [fleet](https://github.com/substack/fleet) by [@substack](https://github.com/substack):
```[sudo] npm install -g fleet```  
 
Add a new remote to a git repo (use the app.js example):  
```fleet remote add default --hub=example.com:7000 --secret=beepboop```

Deploy:  
```fleet deploy```  

Spawn a process:  
```fleet spawn -- node app.js```  

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

ports.service('example.com', function (port, ready) { // use the domain name you want to deploy
  server.listen(port, ready);
});
```

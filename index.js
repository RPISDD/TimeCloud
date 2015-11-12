var moduleFactory = require('./lib/shared/ModuleFactory.js');
var request = require('./lib/shared/Request.js');
var reply = require('./lib/shared/Reply.js');
var errorHandler = require('./lib/shared/ErrorHandler.js');
var user = require('./lib/shared/User.js');
var fs = require('fs');

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

// sign with RSA SHA256
var cert = fs.readFileSync('rsa.pub');  // get private key

exports.handler = function(event, context){
    var callingFunction = context.functionName;
    var token = event.sessionToken;
    
    var req = request(token,event,context);
    var rep = reply(req);
    var err = errorHandler(req);
    //NEED TO LOOKUP IN USERDB FIRST, FIX
    var decoded = {};
    if(typeof token != 'undefined'){
        try {
  		decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });
	   } 
    	catch(err) {
		//err
        console.log(err);
		console.log("token invalid");

	   }
    }else{
        decoded.RIN = event.RIN;
    }
    var usr = user(decoded.RIN,token);
    
    var module = moduleFactory(callingFunction, usr, req, rep);
    module.run();
};


var serve = function(){
  var express = require('express');
  var app = express();

  app.get('*', function(request, response){
    // Make a context object
    var context = {};
    // Set up callbacks
    context.succeed = context.fail = response.send;
    // Get root URL
    context.functionName = request.url.split('/')[1];

    // Make a fake evt
    var evt = {};

    exports.handler(evt, context);
  });

  var listener = app.listen(8080, function(){
    console.log('Server started');
  });
};

serve();

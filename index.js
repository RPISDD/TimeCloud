var moduleFactory = require('./lib/shared/ModuleFactory.js');
var request = require('./lib/shared/Request.js');
var reply = require('./lib/shared/Reply.js');
var errorHandler = require('./lib/shared/ErrorHandler.js');
var user = require('./lib/shared/User.js');
var fs = require('fs');
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

// sign with RSA SHA256
var cert = fs.readFileSync('rsa');  // get private key

exports.handler = function(event, context){
    var callingFunction = context.functionName;
    var token = event.sessionToken;
    
    var req = request(token,event,context);
    var rep = reply(req);
    var err = errorHandler(req);
    //NEED TO LOOKUP IN USERDB FIRST, FIX
    try {
  		var decoded = jwt.verify(token, cert);
	} 
	catch(err) {
		//err
		console.log("token invalid");

	}
    var usr = user(decoded.RIN,token);
    var usr = user()
    
    var module = moduleFactory(callingFunction, usr, req, rep);
    module.run();
};


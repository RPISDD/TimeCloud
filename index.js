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
	    } catch(err) {
        console.log(err);
		    console.log('token invalid');
	    }
    }
    else {
      decoded.RIN = parseInt(event.RIN);
    }

    console.log('Loading user');
    var usr = user(decoded.RIN,token);

    var module = moduleFactory(callingFunction, usr, req, rep);
    console.log('Running module: ', module);
    module.run();
    console.log('Module completed execution');
};


var serve = function(){
  // Encapsulate expressJS dependency
  var express = require('express');
  var app = express();

  // Enable CORS
  app.use(function(request, result, next) {
    result.header('Access-Control-Allow-Origin', '*');
    result.header('Access-Control-Allow-Headers',
                  'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Enable POST parsing
  var bodyParser = require('body-parser');
  app.use(bodyParser.json()); // Parses application/json
  app.use(bodyParser.urlencoded({extended: true})); // Parses form encoded

  // Generate event and context for Lambda handler
  var genEventContext = function(request, response){
    console.log('Received request');
    // Make a context object
    var context = {};
    // Set up callbacks
    context.succeed = context.fail = function(payload){
      console.log('Sending payload: ', payload);
      console.log('Using response: ', response);
      response.send(payload);
    };
    // Get root URL
    context.functionName = request.path.split('/')[1];

    // Make a fake evt
    var evt = {};

    var extend = function(target, source) {
      for(var index in source){
        target[index] = source[index];
      }
    }
    // Concatenate with query string
    extend(evt, request.query);
    // Concatenate with body
    extend(evt, request.body);

    //TODO: REMOVE
    evt.RIN = '123456'; // Hard-coded

    return { evt: evt, context: context };
  }

  var callLambda = function(eventContext){
    console.log('Calling exports handler');
    try {
      exports.handler(eventContext.evt, eventContext.context);
    } catch(error) {
      console.error('Failed to run module ',
                    eventContext.context.functionName,
                    'for reason:', error);
    }
  }

  // Create GET handler
  app.get('/api/*', function(request, response) {
    var eventContext = genEventContext(request, response);
    eventContext.context.httpMethod = 'GET';
    callLambda(eventContext);
  });

  // Create POST handler
  app.post('/api/*', function(request, response) {
    var eventContext = genEventContext(request, response);
    eventContext.context.httpMethod = 'POST';
    callLambda(eventContext);
  });

  // Serve static content
  app.use('/', express.static('StaticWeb'));

  // Start server
  var listener = app.listen(8080, function(){
    console.log('Server started');
  });
};

serve();

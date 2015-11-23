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

// Server Settings
var SERVER_PORT = 5000;

/* 
 * Main REST Call Handler,
 * Originally Created to handle Amazon Lambda data
 */
exports.handler = function(event, context){
  console.log('Handling event:', event);
  
	event.RIN = Number(event.RIN);

  var callingFunction = context.functionName;
  var token = event.sessionToken;

  var req = request(token,event,context);
  var rep = reply(req);
  var err = errorHandler(req);
   
  var decoded = {};
  if(typeof token != 'undefined'){
    try {
      decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });
      console.log('Token validated');
    } catch(err) {
      console.log(err);
      console.log('token invalid');
      console.log('Invalid token', token);
      return;
    }
  }
  else {
    //decoded.RIN = Number(event.RIN);
    console.log("no token sent");
    if(callingFunction!=='tsLogin' && callingFunction!=='tsSignup') {
      return;
    }
  }

  console.log('Loading user');
  var usr = user(decoded.RIN,token);

  var module = moduleFactory(callingFunction, usr, req, rep);
  module.run();
  console.log('Module completed execution');

};

/*
 * Do general HTTP request handling,
 * prepare data structures for REST processor.
 */
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
      response.send(payload);
    };

    // Parse requested URL
    var pathElements = request.path.split('/');
    // Get root URL
    context.functionName = pathElements[2];
    // Get database
    if(pathElements.length > 3) {
      context.databaseName = pathElements[3];
    }

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
    // Set JWT token
    if(request.headers.authorization){
      evt.sessionToken = request.headers.authorization.split(' ').pop()
        .replace(/"/g,'');
    }

    console.log('Received request query', request.query);

    return { evt: evt, context: context };
  }

  // Function to pass processed requests to REST handler
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

  // Root directory for .html, .css, .js files
  var staticWebLocation = require('process').env.STATIC_WEB_DIR ||
                                            './StaticWeb/dist';

  // Serve static content
  app.use('/', express.static(staticWebLocation));

  // Start server
  var listener = app.listen(SERVER_PORT, function(){
    console.log('Server started, serving from', staticWebLocation);
  });
};

serve();

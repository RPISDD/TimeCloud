var moduleFactory = require('./lib/shared/ModuleFactory.js');
var request = require('./lib/shared/Request.js');
var reply = require('./lib/shared/Reply.js');
var errorHandler = require('./lib/shared/ErrorHandler.js');
var user = require('./lib/shared/User.js');
exports.handler = function(event, context){
    var callingFunction = context.functionName;
    var token = event.sessionToken;
    
    var req = request(token,event,context);
    var rep = reply(req);
    var err = errorHandler(req);
    //NEED TO LOOKUP IN USERDB FIRST, FIX
    var usr = user(123456,token);
    
    var module = moduleFactory(callingFunction, usr, req, rep);
    module.run();
};

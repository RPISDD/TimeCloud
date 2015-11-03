var tsModuleSignup = require('../signup/tsModuleSignup.js');
var tsModuleFriends = require('../friends/tsModuleFriends.js');
var moduleNames = {
    "tsSignup" : tsModuleSignup,
    "tsFriends" : tsModuleFriends
};

var moduleFactory = function(name, user, request, reply, errorHandler){
    var moduleType = moduleNames[name];
    var tsmodule = moduleType();
    
    tsmodule.init(user, request, reply, errorHandler);
    
    return tsmodule;
};
module.exports = moduleFactory;

var tsModuleSignup = require('../signup/tsModuleSignup.js');
var tsModuleFriends = require('../friends/tsModuleFriends.js');
var tsModuleLogin = require('../login/tsModuleLogin.js');
var moduleNames = {
    "tsSignup" : tsModuleSignup,
    "tsFriends" : tsModuleFriends,
    "tsLogin" : tsModuleLogin
};

var moduleFactory = function(name, user, request, reply, errorHandler){
    var moduleType = moduleNames[name];
    var tsmodule = moduleType();
    
    tsmodule.init(user, request, reply, errorHandler);
    
    return tsmodule;
};
module.exports = moduleFactory;

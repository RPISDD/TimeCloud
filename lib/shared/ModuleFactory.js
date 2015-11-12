var tsModuleSignup = require('../signup/tsModuleSignup.js');
var tsModuleFriends = require('../friends/tsModuleFriends.js');
var tsModuleLogin = require('../login/tsModuleLogin.js');
var tsModuleClasses = require('../classes/tsModuleClasses.js');
var tsModuleFacebook = require('../facebook/tsModuleFacebook.js');
var moduleNames = {
    'tsSignup' : tsModuleSignup,
    'tsFriends' : tsModuleFriends,
    'tsLogin' : tsModuleLogin,
    'tsClasses': tsModuleClasses,
    'tsFacebook': tsModuleFacebook,
};

var moduleFactory = function(name, user, request, reply, errorHandler){
    var moduleType = moduleNames[name];
    var tsmodule = moduleType();
    
    tsmodule.init(user, request, reply, errorHandler);
    
    return tsmodule;
};
module.exports = moduleFactory;

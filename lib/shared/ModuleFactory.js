var tsModuleSignup = require('../signup/tsModuleSignup.js');
var moduleNames = {
    "signup" : tsModuleSignup
};

var moduleFactory = function(name){
    return modulenames[name]();
};
module.exports = moduleFactory;

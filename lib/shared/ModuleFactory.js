var signupModule = require('../signup/SignupModule.js');
var moduleNames = {
    "signup" : signupModule
};

var moduleFactory = function(name){
    return modulenames[name]();
};
module.exports = moduleFactory;

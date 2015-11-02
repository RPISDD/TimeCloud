var authenticator = require('../Authenticator.js');
var sessionAuthenticator = function(){
    var obj = authenticator();

    obj.authenticateRead = function(user, key){
	return user.token == key;
    };
    obj.authenticateWrite = function(user,key){
	return false;
    };

    return obj;
};
module.exports = sessionAuthenticator;

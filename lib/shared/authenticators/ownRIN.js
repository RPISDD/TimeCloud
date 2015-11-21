var authenticator = require('../Authenticator.js');
var ownRIN = function(){
    var obj = authenticator();

    obj.authenticateRead = function(user, key){
	return user.RIN == key;
    };
    obj.authenticateWrite = function(user,key){
	return user.RIN == key;
    };

    return obj;
};
module.exports = ownRIN;

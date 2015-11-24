var authenticator = require('../Authenticator.js');
var infoAuthenticator = function(){
  var obj = authenticator();
  
  obj.authenticateRead = function(user, key){
    return true;
  };
  obj.authenticateWrite = function(user,key){
    return true;
  };
  
  return obj;
};
module.exports = infoAuthenticator;

var authenticator = require('../Authenticator.js');
// Allow all traffic
var fullOverride = function(){
  var obj = authenticator();

  obj.authenticateRead = function(user, key){
    console.log('Authorizing', user, 'to', key);
	  return true;
  };
  obj.authenticateWrite = function(user,key){
    console.log('Authorizing',user,'to',key);
    return true;
  };

  return obj;
};
module.exports = fullOverride;

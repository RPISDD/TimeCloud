var authenticator = function(){
  var obj = {};

  obj.authenticateRead = function(user, key){
	  return false;
  };
  obj.authenticateWrite = function(user, key){
	  return false;
  };
  
  return obj;
};
module.exports = authenticator;

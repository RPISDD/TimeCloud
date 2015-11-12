var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleFriends = function(){
  var obj = tsModule();

  obj.init = function(user, request, reply, errorHandler){
	  obj.user = user;
	  obj.request = request;
	  obj.reply = reply;
	  obj.errorHandler = errorHandler;
	
	  obj.friendsDb = databaseFactory('userFriends',user);
	  obj.userInfoDb = databaseFactory('userInfo',user);

    console.log('Initialized friends module');
  };
    
  obj.run = function(){
    console.log('Running friends module');
    console.log('Getting user RIN');
	  obj.friendsDb.get(obj.user.RIN).then(function(res){
      console.log('Got RIN: ', res);
      console.log('Getting batch information');
      obj.userInfoDb.batchGet(res).then(function(res){
        console.log('Got batch information: ', res);
        obj.reply.send(res);
      },
      function(err){
        console.log(err);
        obj.errorHandler.send(err);
      });
	  },
	  function(err){
		  console.log(err);
		  obj.errorHandler.send(err);
	  });
  };  
  
  return obj;
};
module.exports = tsModuleFriends;

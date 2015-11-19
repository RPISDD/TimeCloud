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
    console.log('Friends getting user RIN for ', obj.user.RIN);
    // Get RIN from query string
    var RIN = obj.request.getParamTyped('RIN', Number);
    console.log('Friends list using RIN:', RIN);
    obj.friendsDb.get(RIN).then(function(res){
      if(res === null){
        obj.reply.send(["No friends added"]);
	return;
      }
      console.log('Got RIN: ', res);
      console.log('Getting batch information');
      obj.userInfoDb.batchGet(res).then(function(res){
        console.log('Got batch information: ', res);
        obj.reply.send(res);
        console.log('Sent reply');
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

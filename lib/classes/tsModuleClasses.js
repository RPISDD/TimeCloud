var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleClasses = function(){
  var obj = tsModule();

  obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;
  
    obj.userClassesDb = databaseFactory('userClasses',user);
    obj.classInfoDb = databaseFactory('classInfo',user);
  };

  obj.getClasses = function(){
    console.log('Classes getting user RIN for', obj.user);
    var RIN = obj.request.getParamTyped('RIN', Number);
    obj.userClassesDb.get(RIN).then(function(res){
      if(res === null){
          obj.reply.send(["No classes registered"]);
	  return;
      }
      obj.classInfoDb.batchGet(res).then(function(res){
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
  
  obj.addClass = function() {
    var classCRN = obj.reques.getParamTyped('classCRN', Number);
    obj.classInfo.allKeys().then(function(pars){
      if(pars.indexOf(classCRN)!== -1){
	databaseUtils.mergeDB(obj.userClassesDb, obj.user.RIN, [classCRN]);
	console.log('Added', classCRN, 'to', obj.user.RIN, 'friend list');
	obj.reply.send('Done');
      }
    },function(err){});
    
  };
    
  obj.run = function(){
    var requestType = obj.request.getRequestType();
    if(requestType === 'GET') {
      var requestedDB = obj.request.getRequestedDatabase();
      console.log('Requested class database', requestedDB);
      return obj.getClasses();
    }else if(requestType === 'POST') {
      return obj.addClass();
    }
  };  
  
  return obj;
};
module.exports = tsModuleClasses;

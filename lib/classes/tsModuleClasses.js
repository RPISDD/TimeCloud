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
    
  obj.run = function(){
    console.log('Classes getting user RIN for', obj.user);
    var RIN = obj.request.getParamTyped('RIN', Number);
    obj.userClassesDb.get(RIN).then(function(res){
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
  
  return obj;
};
module.exports = tsModuleClasses;

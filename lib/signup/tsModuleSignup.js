var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleSignup = function(){
    var obj = tsModule();

    obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;

    obj.userdb = databaseFactory('userdb', user);
  };
  obj.run=function(){
    obj.userdb.get(parseInt(obj.request.event.RIN)).then(
      function(res){
        //console.log(res);
        if(res===null){
          //console.log("hi");
          obj.userdb.add(obj.request.event.RIN, obj.request.event.password).then(
            function(res){
              obj.reply.send("user created");
            },
            function(err){
              console.log(err);
              obj.errorHandler.send(err);
            }
          );
        }
      },
      function(err){
        console.log(err);
        obj.errorHandler.send(err);
      }
    );
  };
    return obj;
};
module.exports = tsModuleSignup;

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
    obj.friendsDb = databaseFactory('userFriends', user);
    obj.classDb = databaseFactory('userClasses', user);
  };
  obj.run = function(){
    var RIN = obj.request.event.RIN;
    console.log('Adding user with RIN', RIN);
    obj.userdb.get(parseInt(RIN)).then(function(res){
      if(res===null){
        // Create user
        obj.userdb.add(RIN, obj.request.event.password)
          .then(function(res){
          obj.reply.send("user created");
        },
        function(err){
          console.log(err);
          obj.errorHandler.send(err);
        });
        // Initialize user tables
        obj.friendsDb.addEmpty(RIN).then(function(res) {
          console.log('Initialized user friends db');
        }, function(err) {
          console.log('Error initializing friends db', err);
        });
        obj.classDb.addEmpty(RIN);
      }
    },
    function(err){
      console.log(err);
      obj.errorHandler.send(err);
    });
  };
  return obj;
};
module.exports = tsModuleSignup;

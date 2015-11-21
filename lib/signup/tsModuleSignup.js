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
    obj.classInfo = databaseFactory('classInfo', user);
  };
  obj.run = function(){
    var RIN = obj.request.event.RIN;
    var CRNs = obj.request.event.CRNs.split(" ").map(Number);
    console.log('Adding user with RIN', RIN);
    obj.userdb.get(parseInt(RIN)).then(function(res){
      if(res===null){
        // Create user
        obj.userdb.add(RIN, obj.request.event.password).then(
	  function(res){
            obj.reply.send("user created");
          },
          function(err){
            console.log(err);
            obj.errorHandler.send(err);
          }
	);
        obj.friendsDb.addEmpty(RIN).then(
          function(res) {
            console.log('Initialized user friends db');
          }, function(err) {
            console.log('Error initializing friends db', err);
          }
	);
	obj.classInfo.allKeys().then(
	  function(res){
	    console.log(res);
	    toAdd=[];
	    res.forEach(function(element){
	      if(res.includes(element)){
		toAdd.push(element);
	      }
	    });
	    obj.classDb.add(RIN, toAdd);
	  },
	  function(err){
	    console.log(err);
	    obj.errorHandler.send(err);
	  }
	);
	
        //obj.classDb.add(RIN, CRNs);
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

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
    obj.userInfo = databaseFactory('userInfo', user);
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
	  function(pars){
	    console.log(pars);
	    console.log(CRNs);
	    toAdd=[];
	    console.log('CRN length', CRNs.length);
	    /*for(var i=0;i<CRNs.length; i++){
	    //CRNs.forEach(function(element){
	      console.log('loop');
	      element = CRNs[i];
	      console.log('Current elment', element);
	      if(pars.includes(element)){
		      toAdd.push(element);
	      }
        console.log('End of loop');
	    }*/
      obj.classDb.add(RIN, CRNs.filter(function(elem){
        return pars.indexOf(elem) !== -1;
      }));
	    //obj.classDb.add(RIN, toAdd);
	  },
	  function(err){
	    console.log(err);
	    obj.errorHandler.send(err);
	  }
	);
	obj.userInfo.add(RIN, obj.request.event.first + " " + obj.request.event.last);
	
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

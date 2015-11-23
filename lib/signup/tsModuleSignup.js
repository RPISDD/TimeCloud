var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var cert = fs.readFileSync('rsa');

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
    var CRNs = obj.request.event.CRNs.split(' ').map(Number);
    console.log('Adding user with RIN', RIN);
    // Update user RIN
    obj.user.setRIN(RIN);
    obj.userdb.get(parseInt(RIN)).then(function(res){
      // Check if user already in database
      if(res===null){
        // Add user to database 
        obj.userdb.add(RIN, obj.request.event.password).then(function(res){
	        var data = {
	          'RIN': RIN,
	          'expiresIn': '2h'
	        };
	        var token = jwt.sign(data, cert, {algorithm: 'RS256'});
	        console.log('Generated token:', token);

          console.log('Success');
          obj.reply.send(token);
        },
        function(err){
          console.log(err);
          obj.errorHandler.send(err);
        });
        obj.friendsDb.addEmpty(RIN).then(function(res) {
          console.log('Initialized user friends db');
        }, function(err) {
          console.log('Error initializing friends db', err);
        });
	      obj.classInfo.allKeys().then(function(allCRNs){
	        validUserCRNs = CRNs.filter(function(elem){
            return allCRNs.indexOf(elem) !== -1;
	        });
          console.log('Giving new user CRNs', validUserCRNs);
          if(validUserCRNs.length > 0){
  	        obj.classDb.add(RIN, validUserCRNs);
          } else {
            obj.classDb.addEmpty(RIN);
          }
	      },
	      function(err){
	        console.log(err);
	        obj.errorHandler.send(err);
	      });
	      obj.userInfo.add(RIN, obj.request.event.first + ' ' + obj.request.event.last);
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

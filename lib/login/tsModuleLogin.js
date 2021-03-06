var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var fs = require('fs');
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

// sign with RSA SHA256
var cert = fs.readFileSync('rsa');  // get private key

// Constructs class to handls login requests
var tsModuleLogin = function(){
  var obj = tsModule();

  obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;

    obj.userdb = databaseFactory('userdb', user);
  };
  obj.run = function(){
    // Look user up in database
    obj.userdb.get(parseInt(obj.request.event.RIN)).then(
      function(res){
        if(res!==null){ //user Exists
          if (obj.request.event.password === res){//password is correct
            //generate token
            var data = {
              "RIN": obj.request.event.RIN,
              "expiresIn" : "2h"
            };
            // Generate an authentication token to send to user
            var token = jwt.sign(data, cert, { algorithm: 'RS256'});
            console.log('Generated token:', token);

            console.log("Success");
            // Send the token
            obj.reply.send(token);
          }
          else{
            obj.reply.log("wrong password");
          }
        }
        else{
          obj.reply.log("user does not exist");
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
module.exports = tsModuleLogin;

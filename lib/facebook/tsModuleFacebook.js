var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleFriends = function(){
  var obj = tsModule();

  // Main initializer
  obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;

    obj.friendsDb = databaseFactory('userFriends',user);
    obj.userInfoDb = databaseFactory('userInfo',user);

    console.log('Initialized Facebook friends module');
  };

  // Main execution method
  obj.run = function(){
    console.log('Running FBfriends module');
    var friendIDList = obj.request.getParam('friendsList');
    var selfId = obj.request.getParam('fbId');
    console.log('List of friend IDs:', friendIDList);
    console.log('Facebook ID:', selfId);
    obj.reply.send('Received friends');
    //TODO: grab array
  };

  return obj;
};
module.exports = tsModuleFriends;

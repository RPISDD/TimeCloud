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
    obj.fbDb = databaseFactory('facebookIDs',user);
    console.log('Initialized Facebook friends module');
  };

  // Main execution method
  obj.run = function(){
    console.log('Running FBfriends module');
    var RIN = obj.request.getParamTyped('RIN', Number);
    var friendIDList = obj.request.getParam('friendsList')
      .map(friend => Number(friend));
    var selfId = obj.request.getParamTyped('fbId', Number);
    console.log('List of friend IDs:', friendIDList);
    console.log('Facebook ID:', selfId);
    obj.reply.send('Received friends');
    //TODO: grab array
    //TODO: insert user into facebookIDs, look up RINs of FBID friends, add RINS to friends list
    // Set current user's Facebook ID
    obj.fbDb.set(selfId, RIN); 
    // Find friends in database
    obj.friendsDb.batchGet(friendIDList).then(function(result) {
      // TODO: for each friend result, add friend to list of friend CRNs
      console.log('Got facebook info', result);
    });
  };

  return obj;
};
module.exports = tsModuleFriends;

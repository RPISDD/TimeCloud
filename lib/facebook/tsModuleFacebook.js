var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var databaseUtils = require('../shared/DatabaseUtils.js');
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
    obj.fbToRIN = databaseFactory('userFacebookIdToRIN',user);
    obj.RINToFb = databaseFactory('userRINToFacebookId',user);
    console.log('Initialized Facebook friends module');
  };

  // Main execution method
  obj.run = function(){
    console.log('Running FBfriends module');
    var RIN = obj.request.getParamTyped('RIN', Number);
    // Convert POST data to array of ints (friend UID's)
    var friendIDList = obj.request.getParam('friendsList')
      .map(friend => Number(friend));
    var selfId = obj.request.getParamTyped('fbId', Number);
    console.log('List of friend IDs:', friendIDList);
    console.log('Facebook ID:', selfId);
    obj.reply.send('Received friends');
    // Associate user's FB ID with user's RIN
    obj.fbToRIN.set(selfId, RIN).then(function(res){}, function(err) {
      console.log(err);
    });
    // Associate user's RIN with user's FB ID
    obj.RINToFb.set(RIN, selfId);
    // Find friends in database
    obj.fbToRIN.batchGet(friendIDList).then(function(friendRINs) {
      databaseUtils.mergeDB(obj.friendsDb, RIN, friendRINs);
    });
  };

  return obj;
};
module.exports = tsModuleFriends;

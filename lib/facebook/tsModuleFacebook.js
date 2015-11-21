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
    var friendIDList = obj.request.getParam('friendsList')
      .map(friend => Number(friend));
    var selfId = obj.request.getParamTyped('fbId', Number);
    console.log('List of friend IDs:', friendIDList);
    console.log('Facebook ID:', selfId);
    obj.reply.send('Received friends');
    // Set current user's Facebook ID
    obj.fbToRIN.set(selfId, RIN).then(function(res){}, function(err) {
      console.log(err);
    });
    obj.RINToFb.set(RIN, selfId);
    // Find friends in database
    obj.fbToRIN.batchGet(friendIDList).then(function(friendRINs) {
      console.log('Got friend RINs', friendRINs);
      databaseUtils.mergeDB(obj.friendsDb, RIN, friendRINs);
      /*if(friendRINs !== undefined && friendRINs !== null) {
        obj.friendsDb.get(RIN).then(function(registeredFriends) {
          console.log('User has regisetered friends', registeredFriends);
          if(registeredFriends === null || registeredFriends === undefined){
            obj.friendsDb.set(RIN, friendRINs).then(function(res){},function(err){
              console.log('Error setting friends', err);
            });
            return;
          }
          // Merge old and new friends 
          var friendSet = new Set(registeredFriends);
          friendRINs.forEach(function(friendRIN) {
            friendSet.add(friendRIN);
          });
          // Update database
          if(friendSet.size() > 0) {
            console.log('Setting friends to be', friendSet);
            obj.friendsDb.set(RIN, Array.from(friendSet));
          }
          console.log('Updated with Facebook friends, new friend list', friendSet);
        });
      }
      else {
        console.log('No facebook friends in system');
      }*/
    });
  };

  return obj;
};
module.exports = tsModuleFriends;

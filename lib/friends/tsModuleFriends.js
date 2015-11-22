var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var databaseUtils = require('../shared/DatabaseUtils.js');
var tsModuleFriends = function(){
  var obj = tsModule();

  obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;
  
    obj.friendsDb = databaseFactory('userFriends',user);
    obj.userInfoDb = databaseFactory('userInfo',user);

    console.log('Initialized friends module');
  };

  // Get a list of user's friends
  obj.getFriends = function() {
    // Create a friend data class
    var generateFriend = function(friendRIN, friendName) {
      return { RIN: friendRIN, name: friendName };
    };

    console.log('Friends getting user RIN for ', obj.user.RIN);
    // Get RIN from query string
    var RIN = obj.request.getParamTyped('RIN', Number);
    console.log('Friends list using RIN:', RIN);
    obj.friendsDb.get(RIN).then(function(friendRINs){
      if(friendRINs === null){
        obj.reply.send([generateFriend(null, "No friends added")]);
	      return;
      }
      console.log('Got RIN: ', friendRINs);
      console.log('Getting batch information');
      obj.userInfoDb.batchGet(friendRINs).then(function(friendNames){
        console.log('Got batch information: ', friendNames);
        // Map result to friend object array
        var payload = friendNames.map(function(friendName, index) {
          return generateFriend(friendRINs[index], friendName);
        });
        obj.reply.send(payload);
        console.log('Friend list sent reply', payload);
      },
      function(err){
        console.log(err);
        obj.errorHandler.send(err);
      });
    },
    function(err){
      console.log(err);
      obj.errorHandler.send(err);
    });
  };

  // Get list of friend's classes
  obj.getFriendClasses = function() {
    console.log('Getting friend classes');
    var friendRIN = obj.request.getParamTyped('friendRIN', Number);
    console.log('Friend RIN', friendRIN);

    console.log('Creating special class db accessor');
    // Initialize classes database accessor
    var classDB = databaseFactory('userClasses', obj.user);

    console.log('Overriding authenticator');
    // Override authenticator
    var authindex = require('../shared/authenticators/authindex.js');
    classDB.setAuthenticator(authindex.fullOverride);
    console.log('Friend class overrode authenticator');

    // Get friend's classes
    classDB.get(friendRIN).then(function(friendCRNs) {
      // Resolve CRN's to class names
      var classInfo = databaseFactory('classInfo', obj.user);
      classInfo.batchGet(friendCRNs).then(function(friendClasses){
        obj.reply.send(friendClasses);
      });
    });
  };

  obj.addFriend = function() {
    var friendRIN = obj.request.getParamTyped('friendRIN', Number);
    databaseUtils.mergeDB(obj.friendsDb, obj.user.RIN, [friendRIN]);
    console.log('Added', friendRIN, 'to', obj.user.RIN, 'friend list');
    obj.reply.send('Done');
  };
    
  // Main entry-point
  obj.run = function(){
    var requestType = obj.request.getRequestType();
    if(requestType === 'GET') {
      var requestedDB = obj.request.getRequestedDatabase();
      console.log('Requested friends database', requestedDB);
      if(requestedDB === 'friendsList') {
        return obj.getFriends();
      }
      if(requestedDB == 'friendClasses') {
        return obj.getFriendClasses();
      }
    }else if(requestType === 'POST') {
      return obj.addFriend();
    }
  };  
  
  return obj;
};
module.exports = tsModuleFriends;

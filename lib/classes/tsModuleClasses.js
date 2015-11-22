var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var databaseUtils = require('../shared/DatabaseUtils.js');
var tsModuleClasses = function(){
  var obj = tsModule();

  obj.init = function(user, request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHandler = errorHandler;
  
    obj.userClassesDb = databaseFactory('userClasses',user);
    obj.classInfoDb = databaseFactory('classInfo',user);
    obj.classHoursDb = databaseFactory('classHours', user);
  };

  obj.getClassList = function(){
    console.log('Classes getting user RIN for', obj.user);
    var RIN = obj.request.getParamTyped('RIN', Number);
    // Get list of user's CRNs
    obj.userClassesDb.get(RIN).then(function(CRNList){
      if(CRNList === null){
        console.log('User has no classes', RIN);
        return obj.reply.send([{'CRN': null, 'Name': 'No Classes Registered'}]);
      }
      console.log('Loaded CRNList', CRNList);
      // Associate CRNs with class names
      obj.classInfoDb.batchGet(CRNList).then(function(classNames){
        console.log('Got class names', classNames);
        // Generate list of reply objects
        var payload = classNames.map(function(className, index) {
          return { 'Name': className, 'CRN': CRNList[index]};
        });
        console.log('Sending payload', payload);
        // Send reply objects
        obj.reply.send(payload);
      });
    });
  };

  obj.getClassDetails = function() {
    var CRN = obj.request.getParamTyped('classCRN', Number);
    console.log('Getting class details for', CRN);
    // Get class hours for given CRN
    obj.classHoursDb.get(CRN).then(function(hours) {
      obj.reply.send(hours);
    });
    return;
  };
  
  obj.addClass = function() {
    var classCRN = obj.request.getParamTyped('classCRN', Number);
    obj.classInfoDb.allKeys().then(function(pars){
      if(pars.indexOf(classCRN)!== -1){
	      console.log('Adding ' + classCRN);
        databaseUtils.mergeDB(obj.userClassesDb, obj.user.RIN, [classCRN]);
        console.log('Added', classCRN, 'to', obj.user.RIN, 'friend list');
        obj.reply.send('Done');
      }
    },function(err){});
    
  };
    
  obj.run = function(){
    var requestType = obj.request.getRequestType();
    if(requestType === 'GET') {
      var requestedDB = obj.request.getRequestedDatabase();
      console.log('Requested class database', requestedDB);
      if(requestedDB === 'classDetails') {
        return obj.getClassDetails();
      }
      if(requestedDB === 'classList') {
        return obj.getClassList();
      }
    } else if(requestType === 'POST') {
      return obj.addClass();
    }
  };  
  
  return obj;
};
module.exports = tsModuleClasses;

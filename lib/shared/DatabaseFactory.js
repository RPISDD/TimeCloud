var databaseAccessor = require('./DatabaseAccessor.js');
var authindex = require('./authenticators/authindex.js');
var dbNames = {
  'userFriends':{key:'RIN',value:'friends',auth:authindex.friendsAuthenticator},
  'userInfo':{key:'RIN',value:'Name',auth:authindex.infoAuthenticator},
  'sessiondb':{key:'sessionToken',value:'RIN',
    auth:authindex.sessionAuthenticator},
  'userdb':{key:'RIN', value:'password',auth:authindex.infoAuthenticator},
  'userClasses':{key:'RIN',value:'CRNs',auth:authindex.friendsAuthenticator},
  'classInfo':{key:'CRN',value:'description',auth:authindex.infoAuthenticator},
};
var credentials = require('./credentials.js');

var databaseFactory = function(dbname, dbuser, localMap){
  var names = dbNames[dbname];
  var obj = databaseAccessor();
  
  var ddb = require('dynamodb').ddb(credentials);
  
  obj.setDb(ddb);
  obj.setDbName(dbname);
  obj.setKeyName(names.key);
  obj.setValueName(names.value);
  obj.setAuthenticator(names.auth);
  obj.setUser(dbuser);
  return obj;
};
module.exports = databaseFactory;

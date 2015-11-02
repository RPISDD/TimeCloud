var databaseAccessor = require('./DatabaseAccessor.js');
var authindex = require('./authenticators/authindex.js'):
var dbNames = {
    'userFriends':{key:'RIN',value:'friends', auth:authindex.friendsAuthenticator},
    'sessiondb':{key:'sessionToken',value:'RIN', auth:authindex.sessionAuthenticator}
};
var credentials = require('./credentials.js');

var databaseFactory = function(dbname, localMap){
    var names = dbNames[dbname];
    var obj = databaseAccessor();
    
    var ddb = require('dynamodb').ddb(credentials);
    
    obj.setDbName(dbname);
    obj.setKeyName(names.key);
    obj.setValueName(names.value);
    return obj;
};
module.exports = databaseFactory;

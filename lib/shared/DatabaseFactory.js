var databaseAccessor = require('./DatabaseAccessor.js');
var dbNames = {
    'userFriends':{key:'RIN',value:'friends'},
};
var databaseFactory = function(dbname, localMap){
    var names = dbNames[dbname];
    var obj = databaseAccessor();
    obj.setDbName(dbname);
    obj.setKeyName(names.key);
    obj.setValueName(names.value);
    return obj;
};
module.exports = databaseFactory;

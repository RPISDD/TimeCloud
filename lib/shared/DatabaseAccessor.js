var databaseAccessor = function(){
    var obj = {};
    
    obj.setDb = function(db){
	obj.ddb = db;
    };
    obj.setDbName = function(name){
	obj.dbName = name;
    };
    obj.setKeyName = function(name){
	obj.keyName = name;
    };
    obj.setValueName = function(name){
	obj.valueName = name;
    };
    obj.setUser = function(user){
	obj.user = user;
    };
    obj.get = function(key){
	return new Promise(function(resolve,reject){
	    obj.ddb.getItem(dbName,key, null, {}, function(err,res,cap){
		if(err !== null){ 
		    reject(err);
		}else{
		    resolve(res[valueName]);
		}
	    });
	});
    };
    obj.set = function(key,value){
	return new Promise(function(resolve,reject){
	    var obj = {};
	    obj[valueName]={};
	    obj[valueName].value = value;
	    obj.ddb.updateItem(dbName,key, null, obj, {}, function(err,det,cap){
		if(err !== null){ 
		    reject(err);
		}else{
		    resolve(null);
		}
	    });
	});
    };
    obj.add = function(key, value){
	return new Promise(function(resolve,reject){
	    var obj = {};
	    obj[keyName] = key;
	    obj[valueName] = value;
	    obj.ddb.putItem(dbName, obj, {}, function(err,det,cap){
		if(err !== null){ 
		    reject(err);
		}else{
		    resolve(null);
		}
	    });
	});
    };
    obj.deleteEntry = function(key){};

    return obj;
};
module.exports = databaseAccessor;

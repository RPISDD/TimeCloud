var Promise = require('promise');
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
    obj.setAuthenticator = function(authenticator){
	obj.authenticator = authenticator();
    };
    obj.get = function(key){
	return new Promise(function(resolve,reject){
	    if(!obj.authenticator.authenticateRead(obj.user,key)){
		reject("Access disallowed");
	    }
	    obj.ddb.getItem(obj.dbName,key, null, {}, function(err,res,cap){
		if(err !== null){ 
		    reject(err);
		}else{
		    resolve(res[obj.valueName]);
		}
	    });
	});
    };
    obj.batchGet = function(keys){
	return new Promise(function(resolve,reject){
	    for(var i = 0; i < keys.length; i++){
		if(!obj.authenticator.authenticateRead(obj.user,keys[i])){
		    reject("Access disallowed");
		}
	    }
	    var req={};
	    req[obj.dbName]={'keys':keys};
	    obj.ddb.batchGetItem(req,function(err,res){
		if(err){
		    reject(err);
		}else{
		    var vals = [];
		    for(var i = 0; i<res.items.length; i++){
			vals.push(res.items[i][obj.valueName]);
		    };
		    resolve(vals);
		}
	    });
	});
    };
    obj.set = function(key,value){
	return new Promise(function(resolve,reject){
	    if(!obj.authenticator.authenticateWrite(obj.user,key)){
		reject("Access disallowed");
	    }
	    var dbobj = {};
	    dbobj[valueName]={};
	    dbobj[valueName].value = value;
	    obj.ddb.updateItem(obj.dbName,key, null, dbobj, {}, function(err,det,cap){
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
	    if(!obj.authenticator.authenticateWrite(obj.user,key)){
		reject("Access disallowed");
	    }
	    var dbobj = {};
	    dbobj[keyName] = key;
	    dbobj[valueName] = value;
	    obj.ddb.putItem(obj.dbName, dbobj, {}, function(err,det,cap){
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

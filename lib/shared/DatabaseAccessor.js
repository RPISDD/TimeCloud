//var Promise = require('promise');
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
  obj.getAuthenticator = function(authenticator) {
    return obj.authenticator;
  };
  obj.get = function(key){
    console.log('Getting:', key);
    return new Promise(function(resolve,reject){
      if(!obj.authenticator.authenticateRead(obj.user,key)){
        console.error('Authentication failed!');
        reject('Access disallowed');
      }
      console.log('Accessing dynamo...');
      obj.ddb.getItem(obj.dbName,key, null, {}, function(err,res,cap){
        console.log('Got result: ', res);
        if(err !== null){ 
          console.log('Error in DynamoDB: ', err);
          reject(err);
        }else{
          if(typeof res === 'undefined'){
            console.log('Got undefined result in dynamo: ', res);
            resolve(null);
          }else{
            console.log('Returning from dynamo:', res[obj.valueName]);
            resolve(res[obj.valueName]);
          }
        }
      });
    });
  };
  obj.batchGet = function(keys){
    console.log('Doing batch get for keys:', keys);
    return new Promise(function(resolve,reject){
      for(var i = 0; i < keys.length; i++){
        if(!obj.authenticator.authenticateRead(obj.user,keys[i])){
          reject('Access disallowed');
        }
      }
      var req={};
      req[obj.dbName]={'keys':keys};
      obj.ddb.batchGetItem(req,function(err,res){
        if(err){
          reject(err);
        }else{
          if(!res){
            resolve(null);
          }
          var vals = [];
          for(var i = 0; i<res.items.length; i++){
            vals.push(res.items[i][obj.valueName]);
          }
          resolve(vals);
        }
      });
    });
  };
  obj.getQuery = function(query) {
    return new Promise(function(resolve, reject) {
      obj.ddb.query(obj.dbName, query, {}, function(err, result) {
        if(err !== null){
          reject(err);
        }
        console.log('Database got', result, 'from', query);
        resolve(result);
      });
    });
  };
  obj.set = function(key,value){
    return new Promise(function(resolve,reject){
      if(!obj.authenticator.authenticateWrite(obj.user,key)){
        reject('Access disallowed');
      }
      var dbobj = {};
      dbobj[obj.valueName]={};
      dbobj[obj.valueName].value = value;
      obj.ddb.updateItem(obj.dbName,key, null, dbobj, {}, function(err,det,cap) {
        if(err !== null){ 
          reject(err);
        }else{
          resolve(null);
        }
      });
    });
  };
  obj.batchSet = function(elements){
    var groups = [];
    for(var i=0;i<elements.length;i+=25) {
      groups.push(elements.slice(i, i+25));
    }
    
    return new Promise(function(resolve,reject) {
      groups.forEach(function(items){
	var dbobj={};
	dbobj[obj.dbName]=[];
	items.forEach(function(element) {
	  var temp={};
	  temp[obj.keyName]=element[0];
	  if(typeof element[1] !== 'undefined'){
	    temp[obj.valueName]=element[1];
	  }
	  dbobj[obj.dbName].push(temp);
	});
	obj.ddb.batchWriteItem(dbobj,{},function(err,res,cap) {
	  if(err !== null) {
	    console.log(err);
	    reject(err);
	  } else {
	    resolve(null);
	  }
	});
      });
    });
  };
  // Add key with empty value
  obj.addEmpty = function(key) {
    return new Promise(function(resolve, reject) {
      if(obj.authenticator.authenticateWrite(obj.user, key) === false) {
        reject('Access disallowed');
      }
      var dbobj = {};
      dbobj[obj.keyName] = key;
      console.log('Adding', dbobj, 'to database');
      obj.ddb.putItem(obj.dbName, dbobj, {}, function(err, det, cap) {
        if(err !== null){
          reject(err);
        }else {
          resolve(null);
        }
      });
    });
  };
  // Insert new key-value
  obj.add = function(key, value){
    if(value === undefined) {
      return obj.addEmpty(key);
    }
    return new Promise(function(resolve,reject){
      if(!obj.authenticator.authenticateWrite(obj.user,key)){
        reject('Access disallowed');
      }
      var dbobj = {};
      dbobj[obj.keyName] = key;
      dbobj[obj.valueName] = value;
      obj.ddb.putItem(obj.dbName, dbobj, {}, function(err,det,cap){
        if(err !== null){ 
          reject(err);
        }else{
          resolve(null);
        }
      });
    });
  };
  obj.allKeys = function(){
    return new Promise(function(resolve,reject){
      var options = {attributesToGet: obj.keyName};
      //not using options for now, fix later
      obj.ddb.scan(obj.dbName, {}, function(err,res){
	if(err!==null){
	  reject(err);
	}else{
	  res = res.items.map(function(element){
	    return element[obj.keyName];
	  });
	  resolve(res);
	}
      });
    });
  };
  obj.deleteEntry = function(key){};

  return obj;
};
module.exports = databaseAccessor;

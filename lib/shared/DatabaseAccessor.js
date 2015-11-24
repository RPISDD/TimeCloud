//var Promise = require('promise');
var databaseAccessor = function() {
  var obj = {};
  /* Setter functions for various parts of the databaseAccessor */
  obj.setDb = function(db) {
    obj.ddb = db;
  };
  obj.setDbName = function(name) {
    obj.dbName = name;
  };
  obj.setKeyName = function(name) {
    obj.keyName = name;
  };
  obj.setValueName = function(name) {
    obj.valueName = name;
  };
  obj.setUser = function(user) {
    obj.user = user;
  };
  obj.setAuthenticator = function(authenticator) {
    obj.authenticator = authenticator();
  };
  obj.getAuthenticator = function(authenticator) {
    return obj.authenticator;
  };
  /* Get an item from the DB by key*/
  obj.get = function(key) {
    console.log('Getting:', key);
    return new Promise(function(resolve,reject) {
      if(!obj.authenticator.authenticateRead(obj.user,key)) {
        console.error('Authentication failed!');
        reject('Access disallowed');
      }
      console.log('Accessing dynamo...');
      obj.ddb.getItem(obj.dbName,key, null, {}, function(err,res,cap) {
        console.log('Got result: ', res);
        if(err !== null) { 
          console.log('Error in DynamoDB: ', err);
          reject(err);
        }else{
          if(typeof res === 'undefined') {
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
  /* Get a group of items by passing in an array of keys */
  obj.batchGet = function(keys) {
    console.log('Doing batch get for keys:', keys);
    return new Promise(function(resolve,reject) {
      for(var i = 0; i < keys.length; i++) {
        if(!obj.authenticator.authenticateRead(obj.user,keys[i])) {
          reject('Access disallowed');
        }
      }
      var req={};
      req[obj.dbName]={'keys':keys};
      obj.ddb.batchGetItem(req,function(err,res) {
        if(err) {
          reject(err);
        } else {
          if(!res) {
            resolve(null);
          }
          var vals = [];
          var dict = {};
          for(var i = 0; i<res.items.length; i++) {
            dict[res.items[i][obj.keyName]]=res.items[i][obj.valueName];
            //vals.push(res.items[i][obj.valueName]);
          }
          keys.forEach(function(element){
            vals.push(dict[element]);
          });
          resolve(vals);
        }
      });
    });
  };
  /* Query the database */
  obj.getQuery = function(query) {
    return new Promise(function(resolve, reject) {
      obj.ddb.query(obj.dbName, query, {}, function(err, result) {
        if(err !== null) {
          reject(err);
        }
        console.log('Database got', result, 'from', query);
        resolve(result);
      });
    });
  };
  /* Set an item in the database using a key-value pair, overwriting what is there*/
  obj.set = function(key,value) {
    return new Promise(function(resolve,reject) {
      if(!obj.authenticator.authenticateWrite(obj.user,key)) {
        reject('Access disallowed');
      }
      var dbobj = {};
      dbobj[obj.valueName]={};
      dbobj[obj.valueName].value = value;
      obj.ddb.updateItem(obj.dbName,key, null, dbobj, {}, function(err,det,cap) {
        if(err !== null) { 
          reject(err);
        }else{
          resolve(null);
        }
      });
    });
  };
  /* Set a group of elements in the DB, overwriting.
   * Input is in the form [[key1,value1],[key2,value2],[key3,value3]]
   * There is a time delay to avoid overloading dynamoDB
   */
  obj.batchSet = function(elements) {
    var groups = [];
    for(var i=0;i<elements.length;i+=25) {
      groups.push(elements.slice(i, i+25));
    }
    
    return new Promise(function(resolve,reject) {
      //groups.forEach(function(items) {
      var adds = function(items) {
        if(typeof(items) === 'undefined'){
          resolve(null);
          //return;
        } else {
          var dbobj={};
          dbobj[obj.dbName]=[];
          items.forEach(function(element) {
            var temp={};
            temp[obj.keyName]=element[0];
            temp[obj.valueName]=element[1];
            dbobj[obj.dbName].push(temp);
          });
          obj.ddb.batchWriteItem(dbobj,{},function(err,res,cap) {
            if(err !== null) {
              console.log(obj.dbName+err);
            } else {
              //resolve(null);
              setTimeout(function(){adds(groups.pop());},1500);
            }
          });
        }
      };
      adds(groups.pop());
      //});
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
        if(err !== null) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  };
  // Insert new key-value
  obj.add = function(key, value) {
    if(value === undefined) {
      return obj.addEmpty(key);
    }
    return new Promise(function(resolve,reject) {
      if(!obj.authenticator.authenticateWrite(obj.user,key)) {
        reject('Access disallowed');
      }
      var dbobj = {};
      dbobj[obj.keyName] = key;
      dbobj[obj.valueName] = value;
      obj.ddb.putItem(obj.dbName, dbobj, {}, function(err,det,cap) {
        if(err !== null) { 
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  };
  // get all keys from a database
  obj.allKeys = function() {
    return new Promise(function(resolve,reject) {
      var options = {attributesToGet: obj.keyName};
      obj.ddb.scan(obj.dbName, {}, function(err,res) {
        if(err!==null) {
          reject(err);
        } else {
          res = res.items.map(function(element) {
            return element[obj.keyName];
          });
          resolve(res);
        }
      });
    });
  };
  // remove a DB entry
  obj.deleteEntry = function(key){};

  return obj;
};
module.exports = databaseAccessor;

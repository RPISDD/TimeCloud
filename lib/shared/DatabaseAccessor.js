var databaseAccessor = function(){
    var obj = {};
    
    obj.dbname = '';
    obj.keyname = '';
    obj.valuename = '';
    obj.setUser = function(user){
	obj.user = user;
    };
    obj.get = function(key){
	return new Promise(function(resolve,reject){
	    ddb.getItem(dbname,key, null, {}, function(err,res,cap){
		if(err != null){ 
		    reject(err);
		}else{
		    resolve(res[valuename]);
		}
	    });
	});
    };
    obj.set = function(key,value){
	return new Promise(function(resolve,reject){
	    var obj = {};
	    obj[valuename]={};
	    obj[valuename].value = value;
	    ddb.updateItem(dbname,key, null, obj, {}, function(err,det,cap){
		if(err != null){ 
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

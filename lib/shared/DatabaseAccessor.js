var databaseAccessor = function(){
    obj = {};
    
    obj.setUser = function(user){};
    obj.get = function(key){};
    obj.set = function(key,value){};
    obj.deleteEntry = function(key){};

    return obj;
};
module.exports = databaseAccessor;

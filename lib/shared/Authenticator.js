var authenticator = function(){
    var obj = {};

    obj.authenticateRead = function(user, key){};
    obj.authenticateWrite = function(user, key){};
    
    return obj;
};
module.exports = authenticator;

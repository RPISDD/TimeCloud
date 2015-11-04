var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleFriends = function(){
    var obj = tsModule();

    obj.init = function(user, request, reply, errorHandler){
	obj.user = user;
	obj.request = request;
	obj.reply = reply;
	obj.errorHndler = errorHandler;
	
	obj.friendsDb = databaseFactory('userFriends',user);
	obj.userInfoDb = databaseFactory('userInfo',user);
    };
    
    obj.run = function(){
	obj.friendsDb.get(obj.user.RIN).then(
	    function(res){
		obj.userInfoDb.batchGet(res).then(
		    function(res){
			obj.reply.send(res);
		    },
		    function(err){
			console.log(err);
			obj.errorHandler.send(err);
		    }
		);
	    },
	    function(err){
		console.log(err);
		obj.errorHandler.send(err);
	    }
	);
    };
    
    return obj;
};
module.exports = tsModuleFriends;

var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleFriends = function(){
    var obj = tsModule();

    obj.init = function(user, request, reply, errorHandler){
	obj.user = user;
	obj.request = request;
	obj.reply = reply;
	obj.errorHndler = errorHandler;
	
	obj.friendsDb = databaseFactory('userFriends');
	obj.friendsDb.setUser(user);
    };
    obj.run = function(){
	var acc = this.friendsDb.get(obj.user.RIN);
	acc.then(
	    function(res){
		obj.reply.send(res);
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

var tsModule = require('../shared/Module.js');
var databaseFactory = require('../shared/DatabaseFactory.js');
var tsModuleSignup = function(){
    var obj = tsModule();

    obj.init = function(user, request, reply, errorHandler){
	obj.user = user;
	obj.request = request;
	obj.reply = reply;
	obj.errorHandler = errorHandler;

	ojb.userdb = databaseFactory('userdb', user);

	obj.run=function(){
		obj.userdb.get(request.event.RIN).then(
			function(res){
				if(res===null){
					obj.userdb.add(request.event.RIN, request.event.password).then(
						function(res){
							obj.reply.send("user created");
						},
						function(err){
							console.log(err);
							obj.errorHandler.send(err);
						}
					);
				}
			},
			function(err){
				console.log(err);
				obj.errorHandler.send(err);
			}
		);
		
	}
    return obj;
};
module.exports = tsModuleSignup;
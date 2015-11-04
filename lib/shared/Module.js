var tsModule = function(){
    var obj = {};
    
    obj.init = function(user,request, reply, errorHandler){
	obj.user = user;
	obj.request = request;
	obj.reply = reply;
	obj.errorHndler = errorHandler;
    };
    obj.run = function(){
	obj.errorHandler.send("No module set up, please report this.");
    };

    return obj;
};
module.exports = tsModule;

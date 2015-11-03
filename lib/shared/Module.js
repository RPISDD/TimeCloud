var tsModule = function(){
    var obj = {};
    
    obj.init = function(request, reply, errorHandler){
	obj.request = request;
	obj.reply = reply;
	obj.errorHndler = errorHandler;
    };
    obj.run = function(){};

    return obj;
};
module.exports = tsModule;

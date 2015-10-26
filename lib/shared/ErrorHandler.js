var errorHandler = function(){
    obj = {};
    
    obj.init = function(request_object){
	obj.context = request_object;
    };
    obj.send = function(reply_object){
	obj.context.fail(reply_object);
    };

    return obj;
};

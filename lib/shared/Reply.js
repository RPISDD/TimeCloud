var reply = function(){
    obj = {};

    obj.init = function(request_object){
	obj.request = request_object;
    };
    obj.send = function(reply_object){
	obj.request.context.succeed(reply_object);
    };

    return obj;
};
module.exports = reply;

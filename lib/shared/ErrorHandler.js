var errorHandler = function(){
  var obj = {};
  
  obj.init = function(request_object){
    obj.request = request_object;
  };
  obj.send = function(reply_object){
    obj.request.context.fail(reply_object);
  };
  
  return obj;
};
module.exports = errorHandler;

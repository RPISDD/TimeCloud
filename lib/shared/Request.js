var request = function(token, event, context){
  var obj = {};

  obj.token = token;
  obj.event = event;
  obj.context = context;

  // Getters
  obj.getToken = function(){
    return obj.token;
  };
  obj.getParam = function(param){
    return obj.event[param];
  };
  obj.getParamTyped = function(param, type){
    console.log('Getting param', param, 'from event', event);
    return type(obj.getParam(param));
  };
  obj.getRequestType = function() {
    return obj.context.httpMethod;
  };

  return obj;
};
module.exports = request;

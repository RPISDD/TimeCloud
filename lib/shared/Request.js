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

    return obj;
};
module.exports = request;

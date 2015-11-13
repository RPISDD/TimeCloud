var tsModule = function(){
  var obj = {};
    
  obj.init = function(user,request, reply, errorHandler){
    obj.user = user;
    obj.request = request;
    obj.reply = reply;
    obj.errorHndler = errorHandler;
  };
  obj.run = function(){
    obj.errorHandler.send("Module exists, but is not set up.");
  };
  
  return obj;
};
module.exports = tsModule;

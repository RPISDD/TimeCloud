var reply = function(request_object){
  var obj = {};

  obj.request = request_object;
  obj.send = function(reply_object){
    var rep = {'replyObject': reply_object};
    obj.request.context.succeed(rep);
    console.log('Sent reply');
  };

  return obj;
};
module.exports = reply;

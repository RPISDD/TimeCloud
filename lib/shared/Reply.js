var reply = function(request_object){
  var obj = {};

  obj.request = request_object;
  obj.send = function(reply_object){
    //console.log('Sending reply: ', reply_object, ' using context.succeed: ',
    //  obj.request.context.succeed);
    var rep = {'reply_object': reply_object};
    obj.request.context.succeed(rep);
    //console.log('Sent reply');
  };

  return obj;
};
module.exports = reply;

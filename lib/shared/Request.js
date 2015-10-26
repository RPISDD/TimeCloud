var request = function(token, event, context){
    obj = {};

    obj.token = token;
    obj.event = event;
    obj.context = context;

    return obj;
};
module.exports = request;

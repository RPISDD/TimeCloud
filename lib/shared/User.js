var user = function(RIN, token, CRNs, friends){
  if(CRNs === undefined){
    CRNs = {};
  }
  if(friends === undefined){
    friends = {};
  }

  var obj = {};

  obj.RIN = RIN;
  obj.token = token;
  obj.CRNs = CRNs;
  obj.friends = friends;

  obj.setRIN = function(RIN) {
    obj.RIN = RIN;
  };

  return obj;
};
module.exports = user;

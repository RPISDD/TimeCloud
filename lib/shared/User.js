var user = function(RIN, token, CRNs, friends){
    if(CRNs === undefined){
	CRNs = {};
    }
    if(friends === undefined){
	friends = {};
    }
    obj = {};
    obj.RIN = RIN;
    obj.token = token;
    obj.CRNs = CRNs;
    obj.friends = friends;
    return obj;
};
module.exports = user;

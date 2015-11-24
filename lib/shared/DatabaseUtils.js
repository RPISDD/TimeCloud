var databaseUtils = {
  // Merge an array with an existing database array
  mergeDB : function(dbObj, dbKeyVal, toAddArray) {
    console.log('Performing database merge');
    return new Promise(function(resolve, reject) {
      console.log('Database merge started');
      if(toAddArray.length < 1){
        console.log('Skipping db merge');
        resolve(null);
        return;
      }
      console.log('Merger looking up', dbKeyVal);
      dbObj.get(dbKeyVal).then(function(existingArray) {
        console.log('Merger got back', existingArray);
        if(existingArray === null || existingArray === undefined) {
          console.log('Doing direct overwrite');
          dbObj.set(dbKeyVal, toAddArray);
          return;
        }
        var mergeSet = new Set(existingArray);
        console.log('Initialized merge set', mergeSet);
        for(var index in toAddArray) {
          mergeSet.add(toAddArray[index]);
        }
        var mergeArray = Array.from(mergeSet);
        console.log('New merge list', mergeArray);
        // Update database
        if(mergeArray.length > 0){
          console.log('Merge util writing', mergeArray, 'to database');
          dbObj.set(dbKeyVal, mergeArray).then(function(){
            console.log('Merger db execution completed');
            resolve(null);
          },function(err){
            console.log('Merger failed: ', err);
            reject(err);
          });
        }else {
          console.log('Merger aborting');
        }
        resolve(null);
      });
    });
  }
};

module.exports = databaseUtils;

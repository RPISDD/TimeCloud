var databaseUtils = {
  // Merge an array with an existing database array
  mergeDB : function(dbObj, dbKeyVal, toAddArray) {
    return new Promise(function(resolve, reject) {
      if(toAddArray.length < 1){
        console.log('Skipping db merge');
        resolve(null);
        return;
      }
      dbObj.get(dbKeyVal).then(function(existingArray) {
        if(existingArray === null || existingArray === undefined) {
          console.log('Doing direct overwrite');
          dbObj.set(dbKeyVal, toAddArray);
          return;
        }
        var mergeSet = new Set(existingArray);
        toAddArray.foreach(function(elem) {
          mergeSet.add(elem);
        });
        // Update database
        if(mergeSet.size() > 0){
          console.log('Merge util writing set to database', mergeSet);
          dbObj.set(dbKeyVal, Array.from(mergeSet));
        }
        resolve(null);
      });
    });
  },
  //RORY's SHIT ABOVE
  //////////////////////////////////////////////////
  //MALCOLM's SHIT BELOW

};

module.exports = databaseUtils;

var settings = require('./settings.js');
var semester = settings.SEMESTER;
var request = require('request');
var databaseFactory = require('../shared/DatabaseFactory.js');

/**
 * Downloads Schedule for current semester.
 */
var getSchedule = function(semesters){
  console.log("Getting courses for semester: " + semester);
  /**
  * Build course url
  */
  var course_url = "http://sis.rpi.edu/reg/zs" + semester + ".htm";
  console.log("Loading course from URL: " + course_url);
  
  request.get({
    uri: course_url
  },function(error,response,body){
    if(error){
      return console.error("ERROR: Failed to load course: " + error);
    }
    classes = parseSchedule(body);
  });
}(semester);

/**
 * Perform string parsing on schedule and send to database
 */
var parseSchedule = function(schedule_doc){
  var rows = [];
  var objects =[];
  var count = 0;
  /**
    * While loop breaks up HTML row by row and stores each row in rows[] array
    */
  while(schedule_doc.indexOf('<TR') != -1)
  {
    start = schedule_doc.indexOf('<TR');
    end = schedule_doc.indexOf('</TR>');
    /**
     * Note for malcolm: This was changed and not tested
     */
    rows.push(schedule_doc.substring(start,end));
    schedule_doc = schedule_doc.substring(end+4,schedule_doc.length);
    count++;
  }
  var lastcrn = 0;
  /**
    * For loop does regex matching on every row, looking for CRNs. If a CRN is found, it also looks for class name, days, and times. If it does not, it looks for days/times only and appends them to a previous class to handle edge cases.
    */
  for(i = 0; i < rows.length; i++)
  {
    var crn;
    if(rows[i].search(/\b\d{5}[ ]\b/g) != -1){
      var newobj = [];
      crn = rows[i].match(/\b\d{5}\b/);
      newobj.push(crn[0]);
      name = rows[i].match(/\b[A-Z]{4}-[0-9]{4}-[0-9]{1,2}\b/g);
      newobj.push(name[0]);
      var timeslist = [];
      var temp = '';
      if(rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/) !== null)
      {
	newday = rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/);
	temp = newday[0].replace(/\s+/g, '');
      }
      if(rows[i].match(/[0-9]{1,2}:[0-9]{2}/g) !== null)
      {
	times = rows[i].match(/[0-9]{1,2}:[0-9]{2}/g);
	temp = temp +': '+times[0]+'-'+times[1];
      }
      timeslist.push(temp);
      newobj.push(timeslist);
      objects.push(newobj);
      lastcrn = 0;
    } else if (rows[i].indexOf("CRN") == -1 && rows[i].indexOf("Course-Sec") == -1 && rows[i].indexOf("NOTE:") == -1 && objects.length > 0){
      lastcrn++;
      var temp2 = '';
      if(rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/) !== null)
      {
	newday = rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/);
	temp2 = newday[0].replace(/\s+/g, '');
      }
      if(rows[i].match(/[0-9]{1,2}:[0-9]{2}/g) !== null)
      {
	times = rows[i].match(/[0-9]{1,2}:[0-9]{2}/g);
	temp2 = temp2 +': '+times[0]+'-'+times[1];
      }
      obj = objects[objects.length-lastcrn];
      if(obj[2].indexOf(temp2)===-1&&temp2!==''){
	obj[2].push(temp2);
      }
    }
    
  }
  console.log('Scraping complete, now adding to DB');
  /**
   * Adds to database
   */
  var classNames=[];
  var classTimes=[];
  objects.forEach(function(element){
    classNames.push([Number(element[0]), element[1]]);
    if(element[2][0]!==''){
      classTimes.push([Number(element[0]), element[2]]);
    }
  });
  var classInfo = databaseFactory('classInfo');
  var classHours = databaseFactory('classHours');
  classInfo.batchSet(classNames).then(function(res){console.log('class names added to db');},
				      function(err){console.log('class names not added');});
  classHours.batchSet(classTimes).then(function(res){console.log('class times added to db');},
				      function(err){console.log('class times not added');});
  return objects;
};

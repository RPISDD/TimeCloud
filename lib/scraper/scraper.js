var settings = require('./settings.js');
var semester = settings.SEMESTER;
var request = require('request');
var databaseFactory = require('../shared/DatabaseFactory.js');

/* Download schedule for current semester */
var getSchedule = function(semesters){
  console.log("Getting courses for semester: " + semester);
  /* Build course URL */
  var course_url = "http://sis.rpi.edu/reg/zs" + semester + ".htm";
  console.log("Loading course from URL: " + course_url);
  
  request.get({
    uri: course_url
  },function(error,response,body){
    if(error){
      return console.error("ERROR: Failed to load course: " + error);
    }
    //console.log(body);
    classes = parseSchedule(body);
  });
}(semester);

var parseSchedule = function(schedule_doc){
  var rows = [];
  var objects =[];
  var count = 0;
  while(schedule_doc.indexOf('<TR') != -1)
  {
    start = schedule_doc.indexOf('<TR');
    end = schedule_doc.indexOf('</TR>');
    temp = schedule_doc.substring(start,end);
    rows.push(temp);
    schedule_doc = schedule_doc.substring(end+4,schedule_doc.length);
    count++;
  }
  var lastcrn = 0;
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
      //console.log(objects[objects.length-lastcrn]);
      obj = objects[objects.length-lastcrn];
      obj[2].push(temp2);
    }
    
  }
  console.log(objects);
  var classNames=[];
  var classTimes=[];
  objects.forEach(function(element){
    classNames.push([Number(element[0]), element[1]]);
    classTimes.push([Number(element[0]), element[2]]);
  });
  var classInfo = databaseFactory('classInfo');
  var classHours = databaseFactory('classHours');
  classInfo.batchSet(classNames).then(function(res){console.log(res);},function(err){console.log(err);});
  classHours.batchSet(classTimes);
  return objects;
};
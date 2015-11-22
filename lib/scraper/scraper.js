var settings = require('./settings.js');
var semester = settings.SEMESTER;
var request = require('request');

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
        parseSchedule(body);
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
		temp = schedule_doc.substring(start,end)
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
				times = rows[i].match(/[0-9]{1,2}:[0-9]{2}/g)
				temp = temp +': '+times[0]+'-'+times[1];
			}
			timeslist.push(temp);
			newobj.push(timeslist);
			objects.push(newobj);
			lastcrn = 0;
		} else if (rows[i].indexOf("CRN") == -1 && rows[i].indexOf("Course-Sec") == -1 && rows[i].indexOf("NOTE:") == -1 && objects.length > 0){
			lastcrn++;
			var temp = '';
			if(rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/) !== null)
			{
				newday = rows[i].match(/[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}[MTWRF ]{1}/);
				temp = newday[0].replace(/\s+/g, '');
			}
			if(rows[i].match(/[0-9]{1,2}:[0-9]{2}/g) !== null)
			{
				times = rows[i].match(/[0-9]{1,2}:[0-9]{2}/g)
				temp = temp +': '+times[0]+'-'+times[1];
			}
			console.log(objects[objects.length-lastcrn]);
			obj = objects[objects.length-lastcrn];
			obj[2].push(temp);
		}
		
	}
	console.log(objects);
	console.log(objects.length);
}
	
	
	/*
	var index = schedule_doc.search(/\b\d{5}[ ]\b/g);
	schedule_doc = schedule_doc.substring(index,schedule_doc.length);
	var count = 0;
	while(index != -1){
		endclass = schedule_doc.indexOf("</TR>");
		current_class = schedule_doc.substring(0,endclass);
		crn = current_class.substring(0,5);
		current_class = current_class.substring(5,current_class.length);
		endsname = current_class.indexOf("<");
		sname = current_class.substring(1,endsname);
		current_class = current_class.substring(endsname,current_class.length);
		beglname = current_class.indexOf("\">");
		current_class = current_class.substring(beglname+1,current_class.length);
		endlname = current_class.indexOf("<");
		lname = current_class.substring(1,endlname);	
		current_class = current_class.substr(endlname,current_class.length);
		days = current_class.match(/[MTWRF\s]{3,6}/g);
		console.log(crn);
		console.log(sname);
		console.log(lname);
		time = current_class.match(/[0-9]{1,2}:[0-9]{2}/g);
		console.log(time);
		count++;
		schedule_doc = schedule_doc.substring(endclass,schedule_doc.length);
		console.log(days);
		if(lname == "ARCHITECTURAL DESIGN STUDIO 1")
		{
			return;
		}
		index = schedule_doc.search(/\b\d{5}[ ]\b/g);
		schedule_doc = schedule_doc.substring(index,schedule_doc.length);
	}
	console.log(count);
	//crns = schedule_doc.match(/\b\d{5}[ ]\b/g);
	//name = schedule_doc.match(/\b\w[A-Z]{3}[-][0-9]{4}\b/g);
    //days = schedule_doc.match(/\b[M|T|W|R|F| ]{4}\b/g);
	//time = schedule_doc.match();
	//console.log(crns.length);
	//console.log(name.length);
	//console.log(days.length);
};*/
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'',
	database:'tomorrow',
	port:3306	
});
connection.connect();

function _exec(sql,params,callback){
	connection.query(sql || '', params || [],function(error,results){
		callback(error,results);
	});
}

// mysql version
// var createSQL='insert into story(user_id,storytime,storyplace,storycontent,storyimage,ctime,mtime) values(?,?,?,?,?,NOW(),NOW())';
// var params=new Array();
// params.push(user_id);
// params.push(storyTime);
// params.push(storyPlace);
// params.push(storyContent);
// params.push(storyImage);
// mysqlDB.exec(createSQL,params,function(error,results){
// 		if(error) console.log(error);
// 		console.log(results);
// });

exports.exec = _exec; 
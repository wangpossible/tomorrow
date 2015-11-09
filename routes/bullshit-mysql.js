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

exports.exec = _exec; 
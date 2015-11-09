var mongoose=require("mongoose");
var connection=mongoose.createConnection("'mongodb://127.0.0.1:27017/bullshit");
connection.on('error',function(error){
	console.error(error);
});

module.exports = mongoose;
var mongoose=require("mongoose");
var db=mongoose.createConnection("mongodb://rakuten:whatfangfang@ds055564.mongolab.com:55564/bullshit");
db.on('error',function(error){
	console.error(error);
});

//创建模型
var Schema = mongoose.Schema;  
var storyScheMa = new Schema({
    user_id:  { type:String, default:0  },   		//主人公
    storytime:  { type:Date, default:Date.now }, 	//故事发生时间
	storyplace:  { type:String, default:'' },		//故事发生地点
	storycontent:  { type:String, default:'' }, 	//故事情节
	storyimage:  { type:String, default:'' },   	//故事情节
	ctime:  { type:Date, default:Date.now },		//创建时间
	mtime:  { type:Date, default:Date.now },		//更新时间
});

var themeSchema = new Schema({
	user_id:{type:String, default:0},
	title:{type:String, default:''},
	content:{type:String, default:''},
	image:{type:String, default:''},
	ctime:{type:Date, default:Date.now},
	mtime:{type:Date, default:Date.now}
});


var userSchema = new Schema({
	username:{type:String,default:''},        //用户名
	password:{ type:String, default:''},       //密码
	salt:{ type:String, default:''},           //加盐
	hash:{ type:String, default:''},           //hash
	state:{ type:Number,default:0},            //激活状态
	activationCode:{ type:String, default:''}, //激活码
	ctime:{ type:Date, default:Date.now},      //创建时间
	mtime:{ type:Date, default:Date.now}	   //更新时间
});

//与storys集合关联
exports.story = db.model('storys', storyScheMa);
exports.theme = db.model('themes', themeSchema);
exports.user = db.model('users', userSchema);
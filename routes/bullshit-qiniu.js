var qiniu = require('qiniu');
var fs = require('fs');

var qiniuconfig = {
	host:'7xoaql.com1.z0.glb.clouddn.com',
	access_key:'3gBsBR0ucF5uRUj-JbLLkhHl0coj6R7HSgiET6oo',
	secret_key:'KIAdg5g9uF2SokHIRJdYX75PfDZc2qxBrfb6XZQI',
	bucket:'wangshoufang',
	expires:'36000'
}

qiniu.conf.ACCESS_KEY = qiniuconfig.access_key;
qiniu.conf.SECRET_KEY = qiniuconfig.secret_key;

var bucket = qiniuconfig.bucket;
var uptoken = _generateUpToken(bucket);
var extra = _generateUpExtra();

//生成上传凭证
function _generateUpToken(bucketName){
	var putPolicy = new qiniu.rs.PutPolicy(bucketName);
	return putPolicy.token();
}

// 生成上传额外参数
function _generateUpExtra(){
	return new qiniu.io.PutExtra();
}

function _upload(filePath,fileType,callback){
	fs.readFile(filePath, function(error, data){
		var filename = Math.random() + '.' + fileType;
		qiniu.io.put(uptoken, filename, data, extra, function(err, ret) {
			if(err) console.log(err);
			callback('//'+qiniuconfig.host+'/'+ret.key);
		});
	});
}

exports.upload = _upload;
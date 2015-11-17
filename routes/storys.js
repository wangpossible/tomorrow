var express = require('express');
var moment = require('moment');
var mongoDB = require('./bullshit-mongo');
var mysqlDB = require('./bullshit-mysql');
var qiniuUpload = require('./bullshit-qiniu');
var formidable = require('formidable');
var router = express.Router();


/**
 * 故事列表
 * 
*/
router.get('/', requiredAuthentication, function(req, res, next) {
	    var user_id = req.session.user._id;
		var title={};
		var events=new Array();
		mongoDB.theme.findOne({}, function(error,result){
			var text = {};
			text.headline = result.title;
			text.text = result.content;
			var media = {};
			media.caption = '';
			media.credit = '';
			media.url = result.image;
			media.thumbnail = result.image;;
			var background = {};
			background.color = 'red';
			
			//设置timeline 的title
			title.text = text;
			title.media =  media;
			title.background = background;
		});
		
		mongoDB.story.find({},function(error,results){
			results.forEach(function(result){
					var story ={};				
					var start_date = {};
					start_date.year =   moment(result.storytime).get('year');
					start_date.month =  moment(result.storytime).get('month')+1;
					start_date.day =    moment(result.storytime).get('date');
					start_date.hour =   moment(result.storytime).get('hour'); 
					start_date.minute = moment(result.storytime).get('minute');
					start_date.second = moment(result.storytime).get('second');
					start_date.millisecond = moment(result.storytime).get('millisecond');
					start_date.format = '';
					
					var media = {};
					media.caption = '';
					media.credit = '';
					media.url = result.storyimage;
					media.thumbnail = result.storyimage;	
					
					var text = {};
					text.headline = result.storyplace;
					text.text = result.storycontent;
					
					story.start_date = 	start_date;
					story.media = media;
					story.text = text; 
					events.push(story);				
				});	
				var data ={'title':title,'events':events};
				res.render('storys',{'title':'故事列表','timelinedata':JSON.stringify(data)});	
		});
});


/**
 * 去创建故事
 * 
*/
router.get('/create',requiredAuthentication,function(req, res, next){
	res.render('story_create',{title:'故事新编'});
});


/**
 * 创建故事
 * 
*/
router.post('/create',requiredAuthentication,function(req, res, next){
	//处理上传表单 具体参考 https://cnodejs.org/topic/4f16442ccae1f4aa2700104d
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if(err) console.log(err);
		qiniuUpload.upload(files.storyImage.path,'jpg',function(fname){
			var story = {};
			story.user_id = req.session.user._id;
			story.storytime = fields.storyTime;
			story.storyplace = fields.storyPlace;
			story.storycontent = fields.storyContent;
			story.storyimage = fname;	
			var storyEntity = new mongoDB.story(story);
			storyEntity.save();
			console.log('创建故事成功');
		})
	});	
	res.redirect('/story');	
});

/**
 * 去更新故事
 * 
*/
router.get('/update/:id',requiredAuthentication,function(req, res, next){
		mongoDB.story.findOne({'_id':req.params.id},function(error,result){
			res.render('story_update',{'title':'更新故事','story':result});	
		});
});

/**
 * 更新故事
 * 
*/
router.post('/update',requiredAuthentication,function(req, res, next){	
	var story = {};
	story.storytime = req.body.storyTime;
	story.storyplace = req.body.storyPlace;
	story.storycontent = req.body.storyContent;
	story.mtime = moment(new Date());
	mongoDB.story.update({'_id':req.body.id},{$set:{"storytime":story.storytime,"storyplace":story.storyplace,"storycontent":story.storycontent,"mtime":story.mtime}},function(error,result){
		res.redirect('/story');	
	});		
});


/**
 * 取消故事
 * 
*/
router.get('/delete/:id',requiredAuthentication,function(req, res, next){
		if(req.params.id){
			mongoDB.story.remove({'_id':req.params.id},function(){
				res.redirect('/story');		
			});
		}else{
			res.redirect('/story');
		}
});


/**
 * 创建主题
 * 
*/
router.post('/theme',requiredAuthentication,function(req, res, next){	
	var theme = {'user_id':req.session.user._id,'title':'我们结婚了','content':'经历了漫长的爱情长跑之后，我们结婚了','image':'http://7xoaql.com1.z0.glb.clouddn.com/0.6008898080326617.jpg','ctime':'2015-11-11 11:11:11','mtime':'2015-11-11 11:11:11'};
	var themeEntity = new mongoDB.theme(theme);
	themeEntity.save();
	res.redirect('/story');
});

function requiredAuthentication(req, res, next){
    if(req.session.user){
        next();
    }else{
        req.session.error = '请先登录';
        res.redirect('/user/login');
    }    
}

module.exports = router;
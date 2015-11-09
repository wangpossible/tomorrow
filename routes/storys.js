var express = require('express');
var moment = require('moment');
var mysqlDB = require('./bullshit-mysql');
var router = express.Router();


/**
 * 故事列表
 * 
*/
router.get('/', function(req, res, next) {
	    var user_id = 1;
		// 查询主题 limit 1
		var themeSQL = 'select id, user_id, title, content, ctime, mtime  from theme where user_id = ? limit 1';
		var storysSQL = 'select id, user_id, storytime, storyplace, storycontent, ctime, mtime from story where user_id = ?';
		
		
		var title={};
		var events=new Array();
		
		mysqlDB.exec(themeSQL,user_id,function(error,results){
			var text = {};
			text.headline = results[0].title;
			text.text = results[0].content;
			var media = {};
			media.caption = '';
			media.credit = '';
			media.url = 'images/wedding.png';
			media.thumbnail = 'images/wedding.png';
			var background = {};
			background.color = 'red';
			
			//设置timeline 的title
			title.text = text;
			title.media =  media;
			title.background = background;		
			
		});
		
		mysqlDB.exec(storysSQL,user_id,function(error,results){
			results.forEach(function(result){
				var story ={};				
				var start_date = {};
				start_date.year =   moment(result.storytime).get('year');
				start_date.month =  moment(result.storytime).get('month');
				start_date.day =    moment(result.storytime).get('date');
				start_date.hour =   moment(result.storytime).get('hour'); 
				start_date.minute = moment(result.storytime).get('minute');
				start_date.second = moment(result.storytime).get('second');
				start_date.millisecond = moment(result.storytime).get('millisecond');
				start_date.format = '';
				
				var media = {};
				media.caption = '';
				media.credit = '';
				media.url = 'images/wedding.png';
				media.thumbnail = 'images/wedding.png';	
				
				var text = {};
				text.headline = result.storyplace;
				text.text = result.storycontent;
				
				story.start_date = 	start_date;
				story.media = media;
				story.text = text; 
				events.push(story);				
			});	
			var data ={'title':title,'events':events};
			console.log(data);
			res.render('storys',{'title':'故事列表','timelinedata':JSON.stringify(data)});						
		});			
	
});


/**
 * 去创建故事
 * 
*/
router.get('/create',function(req, res, next){
	res.render('story_create',{title:'故事新编'});
});


/**
 * 创建故事
 * 
*/
router.post('/create',function(req, res, next){
	var user_id=1;
	var storyTime=req.body.storyTime;
	var storyPlace=req.body.storyPlace;
	var storyContent=req.body.storyContent;
	var createSQL='insert into story(user_id,storytime,storyplace,storycontent,ctime,mtime) values(?,?,?,?,NOW(),NOW())';
	var params=new Array();
	params.push(user_id);
	params.push(storyTime);
	params.push(storyPlace);
	params.push(storyContent);
	mysqlDB.exec(createSQL,params,function(error,results){
			if(error) console.log(error);
			console.log(results);
			console.log('over');
	});	
	res.redirect('/storys');	
});

/**
 * 去更新故事
 * 
*/
router.get('/update/:id',function(req, res, next){
	console.log(req.params.id);	
});

/**
 * 更新故事
 * 
*/
router.post('/update',function(req, res, next){
	console.log('post update story');
	console.log(req.body.storyTime);	
});


/**
 * 取消故事
 * 
*/
router.get('/delete/:id',function(req, res, next){
		console.log(req.params.id);	
});

module.exports = router;
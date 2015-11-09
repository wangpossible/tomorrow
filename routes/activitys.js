var express = require('express');
var router = express.Router();


/**
 * 活动列表
 * 
*/
router.get('/', function(req, res, next) {
		res.render('activitys',{title:'活动列表'});		
});


/**
 * 去创建活动
 * 
*/
router.get('/create',function(req, res, next){
	
	
});


/**
 * 创建活动
 * 
*/
router.post('/create',function(req, res, next){
	
	
});

/**
 * 去更新活动
 * 
*/
router.get('/update/:id',function(req, res, next){
	
	
});

/**
 * 更新活动
 * 
*/
router.post('/update',function(req, res, next){
	
	
});


/**
 * 取消活动
 * 
*/
router.get('/delete/:id',function(req, res, next){
			
});

module.exports = router;
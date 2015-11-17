var express = require('express');
var mongoDB = require('./bullshit-mongo');
var pass = require('./bullshit-pass');
var router = express.Router();

/* 个人中心 */
router.get('/', requiredAuthentication,function(req, res, next) { 
  console.log(req.headers.referer);  
  res.render('profile',{title:'欢迎光临','userinfo':req.session.user});
});

//去登陆页面
router.get('/login',function(req, res, next){
    console.log(req.headers.referer);
    res.render('login',{title:'登录'});
});


// 登录操作
router.post('/login',function(req, res, next){
    console.log(req.headers.referer);
    var username = req.body.username;
    var password = req.body.password;
    authenticate(username,password,function(error,user){
        if(user){
             req.session.regenerate(function (){
                req.session.user = user;
                req.session.success = '登录成功';
                res.redirect('/user');
            });
        }else{
             req.session.error = '用户名和密码输入有误';
             res.redirect('/user/login');
        }
    });
});

//去注册页面
router.get('/signup',function(req, res, next){
    console.log(req.headers.referer);  
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="bg-danger">' + err + '</p>';
    if (msg) res.locals.message = '<p class="bg-success">' + msg + '</p>';     
    if(req.session.user) {
        res.redirect("/");
    }else{
        res.render('signup',{title:'注册'}); 
    }    
});


// 注册操作
router.post('/signup',userExist,function(req, res, next){
    console.log(req.headers.referer);
    var username = req.body.username;
    var password = req.body.password; 
    //把密码加盐
    pass.hash(password,function(error,salt,hash){
        if (error) throw error;
        var user = new mongoDB.user({
            'username':username,
            'salt':salt,
            'hash':hash,
            'state':0,
            'activationCode':'12345'
        }).save(function(error,newuser){
            if (error) throw error;
                authenticate(newuser.username,password,function(error,user){
                if(user){
                    req.session.regenerate(function (){
                        req.session.user = user;
                        req.session.success = '登录成功';
                        res.redirect('/user');
                    });
                }else{
                    req.session.error = '用户名或者密码错误，请重新登录';
                    res.redirect('/user/login');
                }
            });
        });
    });   
    
});

// 退出登录操作
router.get('/loginout',function(req, res, next){
    console.log(req.headers.referer);
    req.session.destroy(function(){
        res.redirect('/user');
    });
});

//登录验证
function authenticate(username,password,callback){
      mongoDB.user.findOne({'username':username},function(error,user){
          if(user){
              if(error) return callback(new Error('cannot find user'));
              pass.hash(password,user.salt,function(err,hash){
                if(err) return callbak(err);
                if(hash == user.hash){
                    return callback(null,user);
                }else{
                    return callback(new Error('密码输入错误'));      
                }
              });
          }else{
             return callback(new Error('当前用户不存在'));  
          }
      })
}

function requiredAuthentication(req, res, next){
    if(req.session.user){
        next();
    }else{
        req.session.error = '请先登录';
        res.redirect('/user/login');
    }    
}

function userExist(req, res, next){
    mongoDB.user.count({'username':req.body.username},function(error,count){
        if(count == 0){
            next();
        }else{
            req.session.error = "当前用户已存在";
            res.redirect("/user/signup");      
        }
    });
}

module.exports = router;
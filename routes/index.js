var exports = module.exports = function(app) {

  var redis = require('redis').createClient()
    , config = require('../config')
    , fs = require('fs')
    , myconsole = require('myconsole')
    , crypto = require('crypto')
    , async = require('async')
    , service = require('../lib')
    ;

  function requireLogin(req, res, next) {
    // --- for test
    if(req.query.test_user) {
      req.session.username = req.query.test_user;
      return next();
    }
    // --- end test
    if(!req.session.username) {
      return res.redirect('/login.html');
    }

    next();
  }

  app.get('/', requireLogin, function(req, res, next) {
      res.redirect('/index.html');
      // res.render('index', {
      //     pageid: 'index'
      // })
  })

  app.get('/login', function(req, res, next) {
      res.render('login', {})
  })

  app.get('/logout', function(req, res, next) {
      req.session.destroy(function(){
          res.redirect('/');
      })
  })

  app.post('/login', function(req, res, next) {
      service.checkUserAuth(req.body.username, req.body.password, function(err, ok) {
          if(err) {return next(err);}
          if(ok) {
            req.session.username = req.body.username
            res.redirect('/');
          } else {
            res.render('login', {
                message1: 'Wrong username or password'
            });
          }
      })
  });

  app.post('/signup', function(req, res, next) {
      var user = req.body;
      if(user.password != user['repeat-password']) {
        res.render('login', {
            message2: 'password is not match'
        })
      }
      delete user['repeat-password'];
      service.createUser(user, function(err, data) {
          if(err) {return next(err);}
          req.session.username = user.username;
          res.redirect('/');
      })
  })

  app.post('/group/create', requireLogin, function(req, res, next) {
      var group = req.body;
      group.owner = req.session.username;
      service.createGroup(group, function(err, data) {
          if(err) {return next(err);}
          res.redirect('/');
      })
  })

  app.post('/upload', function(req, res, next) {
      var user = req.session.username
        , user_images = user + ':images'
        , imageurl = req.body.imageurl
        ;

      // simplest validation
      if(imageurl.indexOf('http') != 0) {
        return next('input ' + imageurl + ' is not url')
      }

      service.addImage(user, {url: imageurl}, function(err, data) {
          if(err) {return next(err);}
          res.redirect('/');
      })

  });

  app.get('/search', function(req, res, next) {
      var keyword = req.query.q
        , username = req.session.username;

      service.queueSearch(req.session.username, keyword, function(err, data) {
          if(err) {return next(err);}
          res.redirect('/');
      })

  });

}

var exports = module.exports = function(app) {

  var redis = require('redis').createClient()
    , config = require('../config')
    , fs = require('fs')
    , myconsole = require('myconsole')
    , crypto = require('crypto')
    , async = require('async')
    , service = require('../lib')
    ;

  app.get('/pop', function(req, res, next) {
      res.redirect('/mark');
  })

  app.get('/', function(req, res, next) {
      res.render('index', {
          pageid: 'index'
      })
  })

  app.get('/login', function(req, res, next) {
      res.render('login', {})
  })

  app.post('/login', function(req, res, next) {
      req.session.username = req.body.username
      res.redirect('/');
  });

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

var exports = module.exports = function(app) {

  var redis = require('redis').createClient()
    , config = require('../config')
    , fs = require('fs')
    , myconsole = require('myconsole')
    , crypto = require('crypto')
    , async = require('async')
    , service = require('../lib')
    , http = require('http')
    ;

  function sendjson(res, nullstatus) {
    return function(err, data) {
      if(err) console.log(err && err.stack);
      if(err) return res.json({msg: err.message}, 500);
      if(!data) {
        if(statusCode)
          return res.json({msg: http.STATUS_CODES[nullstatus]}, nullstatus);
        else
          return res.send();
      } else {
        res.json({data: data});
      }
    }
  }


  app.get('/api/login', function(req, res, next) {
      var username = req.body.username
        , password = req.body.password
        ;

      service.checkUserAuth(username, password, function(err, data) {
          if(err) {return next(err);}
          if(data) {
            res.json({data: 'OK'});
          } else {
            res.json({msg: 'Wrong username or password'}, 403)
          }
      });
  });

  app.post('/api/sendmsg', function(req, res, next) {
      // TODO
  })

  app.post('/api/signup', /* userform , */ function(req, res, next) {
      var user = req.body;
      service.createUser(user, sendjson(res, 403));
  })

  app.post('/api/checkusername', function(req, res, next) {
      var username = req.body.username;
      service.existsUser(username, function(err, exist) {
          if(exist) {
            res.json({msg: 'user exists'}, 403);
          } else {
            res.send();
          }
      })
  })

  app.post('/api/group/create', function(req, res, next) {
      var group = req.body;
      service.createGroup(group, sendjson(res, 403));
  })

  app.post('/api/group/update', function(req, res, next) {
      // TODO
  })

  app.post('/api/group/remove', function(req, res, next) {
      // TODO
  })

  app.post('/api/group/hot_topics', function(req, res, next) {
      var groupid = req.body.groupid;
      service.getHotTopics(groupid, sendjson(res))
  })

  app.post('/api/group/my_topics', function(req, res, next) {
      
  })

  app.post('/api/group/joined_topics', function(req, res, next) {
      
  })

  app.post('/api/group/timeline', function(req, res, next) {

  })

  app.post('/api/group/users', function(req, res, next) {
      var groupid = req.body.groupid;
      service.getGroupUsers(groupid, sendjson(res));
  });

}

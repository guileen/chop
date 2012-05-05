var chop = require('./chop')
  , share = require('../lib/share')
  ;

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

  function requireLogin(req, res, next) {
    // --- for test
    if(req.query.test_user) {
      req.session.username = req.query.test_user;
      return next();
    }
    // --- end test
    if(!req.session.username) {
      return next(new Error('require login'));
    }

    next();
  }


  app.post('/api/login', function(req, res, next) {
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

  app.post('/api/profile', requireLogin, function(req, res, next) {
      res.json({username: req.session.username});
  })

  app.post('/api/sendmsg', requireLogin, function(req, res, next) {
      var message = req.body;
      // TODO markdown
      console.log(message);
      message.sender = req.session.username;
      message.date = Date.now();
      service.newMessage(message, function(err, data) {
          if(err) {return next(err);}
          message.datetime = share.simpleDate(new Date());
          chop.getTopicChannel(message.topicid).broadcast(message);
          res.end();
      });
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

  app.post('/api/group/create', requireLogin, function(req, res, next) {
      var group = req.body;
      service.createGroup(group, sendjson(res, 403));
  })

  app.post('/api/group/update', requireLogin, function(req, res, next) {
      // TODO
  })

  app.post('/api/group/remove', requireLogin, function(req, res, next) {
      // TODO
  })

  app.get('/api/homegroups', requireLogin, function(req, res, next) {
      service.getHomeGroups(req.session.username, sendjson(res));
  });

  app.post('/api/group/hottopics', requireLogin, function(req, res, next) {
      var groupid = req.body.groupid;
      service.getHotTopics(groupid, sendjson(res))
  })

  app.post('/api/group/mytopics', requireLogin, function(req, res, next) {
      
  })

  app.post('/api/group/joinedtopics', requireLogin, function(req, res, next) {
      
  })

  app.post('/api/group/newtopic', requireLogin, function(req, res, next) {
      var topic = req.body;
      topic.creater = req.session.username;
      service.createTopic(topic, sendjson(res, 403));
  })

  app.post('/api/group/timeline', requireLogin, function(req, res, next) {

  })

  app.post('/api/group/users', requireLogin, function(req, res, next) {
      var groupid = req.body.groupid;
      service.getGroupUsers(groupid, sendjson(res));
  });

  app.get('/api/topic/history', requireLogin, function(req, res, next) {
      //TODO
  })

}

var config = require('../config')
  , redis = config.redisClient
  , myconsole = require('myconsole')
  , crypto = require('crypto')
  , robotskirt = require('robotskirt')
  , async = require('async');

var USER_ = 'user:'
  , GROUP_ = 'group:'
  , GROUP_USERS_ = 'groupusers:'
  , TOPIC_ = 'topic:'
  , MSG_ = 'msg:'
  , CHANNEL_ = 'channel:'

  , _USERS = ':users'

  , TOPICLINE_ = 'topicline:'
  , TOPIC_UPDATELINE_ = 'topic_updateline:'
  , MESSAGE_LINE_ = 'messageline:'

  , GROUPID = 'seq:groupid'
  , TOPICID = 'seq:topicid'
  , MESSAGEID = 'seq:messageid'
  ;

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

exports.existsUser = function(username, callback) {
  var key = USER_ + username;
  redis.exists(key, callback);
}

/**
 * user:
 *    username:
 *    password:  md5(password)
 *
 */
exports.createUser = function(user, callback) {
  if(!user.username) return callback(new Error('username is required'));
  var key = USER_ + user.username;
  redis.exists(key, function(err, ex) {
      if(err || ex) return callback(err || new Error('User ' + user.username + ' exists'));
      user.password = md5(user.password);
      redis.hmset(key, user, callback);
  })
}

exports.checkUserAuth = function(username, password, callback) {
  redis.hget(USER_ + username, 'password', function(err, data){
      callback(err, data == md5(password));
  });
}

/**
 * topic:
 *    id: 123
 *    creater: userid
 *    groupid: groupid
 *    title:
 *    datetime: str
 *
 */
exports.createTopic = function(topic, callback) {
  redis.incr(TOPICID, function(err, topicid) {
      if(err) return callback(err);
      var key = TOPIC_ + topicid;
      var groupid = topic.groupid;
      topic.id = topicid;
      redis.multi()
        .hmset(key, topic)
      // sort topicline by create time
        .zadd(TOPICLINE_ + groupid, Date.now(), topicid)
        .zadd(TOPIC_UPDATELINE_ + groupid, Date.now(), topicid)
        .exec(function(err, data) {
          if(err) return callback(err);
          callback(null, topic);
      });
  });
}

/**
 * group:
 *
 *    name: group.name
 *    owner: userid
 *
 */
exports.createGroup = function(group, callback) {
  // FIXME group incr id
  var key = GROUP_ + group.name;
  redis.exists(key, function(err, ex) {
      if(err || ex) return callback(err || new Error('Group ' + group.name + ' exists'));
      redis.hmset(key, group, callback);
  });
}

/**
 * get all groups show in home page of a user
 *
 */
exports.getHomeGroups = function(userid, callback) {
  // TODO hot groups or recommender groups
  redis.keys(GROUP_ + '*', function(err, data) {
      if(err) {return callback(err);}
      async.map(data, function(key, _callback) {
          redis.hgetall(key, _callback);
      }, callback);
  })
}

exports.getGroupUsers = function(groupid, callback) {
  redis.zrevrange(GROUP_USERS_ + groupid, 0, -1, function(err, data) {
      if(err) {return callback(err);}
      async.map(data, function(id, _callback) {
          redis.hgetall(USER_ + id, _callback)
      }, callback);
  });
}

// 按加入时间排序
exports.userAddToGroup = function(groupid, userid, callback) {
  console.log([groupid, userid])
  redis.zadd(GROUP_USERS_ + groupid, Date.now(), userid, callback);
}

/**
 * message:
 *
 *    id: 
 *    text: text
 *    sender: 
 *    topicid: topicid
 *    userid: userid
 *    datetime: str
 *    date: timestamp
 *
 */
exports.newMessage = function(message, callback) {
  var topicid = message.topicid;
  var html = robotskirt.toHtml(message.text, function(html) {
      // FIXME !!!!
      // TODO XSS protection
      message.html = html.toString();

  if(!topicid) return callback(new Error('topicid is required'));
  redis.hget(TOPIC_ + topicid, 'groupid', function(err, groupid) {
      if(err) {return callback(err);}
      redis.incr(MESSAGEID, function(err, msgid) {
          if(err) return callback(err);
          var key = MSG_ + msgid;
          message.id = msgid;
          redis.multi()
            .hmset(key, message)
            .zadd(MESSAGE_LINE_ + topicid, Date.now(), msgid)
            .zadd(TOPIC_UPDATELINE_ + groupid, Date.now(), topicid)
            .exec(callback);
      });
  });

  });
}

/**
 * latest replied topics
 *
 * TODO more intelligence
 */
exports.getHotTopics = function(groupid, callback) {
  redis.zrange(TOPIC_UPDATELINE_ + groupid, 0, 10, function(err, data) {
      if(err) {return callback(err);}
      async.map(data, function(id, _callback) {
          redis.hgetall(TOPIC_ + id, _callback)
      }, callback)
  });
}

exports.getTopicHistory = function(topicid, callback) {
  redis.zrange(MESSAGE_LINE_ + topicid, 0, 10, function(err, data) {
      if(err) {return callback(err);}
      async.map(data, function(msgid, _callback) {
          redis.hgetall(MSG_ + msgid, _callback);
      }, callback);
  })
}

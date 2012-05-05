var config = require('../config')
  , redis = config.redisClient
  , myconsole = require('myconsole')
  , crypto = require('crypto')
  , async = require('async');

var USER_ = 'user:'
  , GROUP_ = 'group:'
  , TOPIC_ = 'topic:'
  , MSG_ = 'msg:'
  , CHANNEL_ = 'channel:'

  , TOPICLINE_ = 'topicline:'
  , TOPIC_UPDATELINE_ = 'topic_updateline:'
  , MESSAGE_LINE_ = 'messageline:'

  , TOPICID = 'seq:topicid'
  , MESSAGEID = 'seq:messageid'
  ;

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * user:
 *    username:
 *    password:  md5(password)
 *
 */
exports.createUser = function(user, callback) {
  var key = USER_ + user.username;
  redis.exists(key, function(err, ex) {
      if(err || ex) return callback(err || new Error('User ' + user.username + ' exists'));
      user.password = md5(user.password);
      redis.hmset(key, user, callback);
  })
}

exports.checkUserAuth = function(username, password, callback) {
  redis.hget(USER_ + user.username, 'password', function(err, data){
      callback(err, data == md5(data));
  });
}

/**
 * topic:
 *    id: 123
 *    groupid: groupid
 *    title:
 *
 */
exports.createTopic = function(topic, callback) {
  redis.incr(TOPICID, function(err, topicid) {
      if(err) return callback(err);
      var key = TOPIC_ + topicid;
      topic.id = topicid;
      redis.multi()
        .hmset(key, topic)
      // sort topicline by create time
        .zadd(TOPICLINE_ + topic.groupid, Date.now())
        .exec(callback);

      redis.publish(CHANNEL_ + )
  });
}

/**
 * group:
 *
 *    name: group.name
 *
 */
exports.createGroup = function(group, callback) {
  var key = GROUP_ + group.name;
  redis.exists(key, function(err, ex) {
      if(err || ex) return callback(err || new Error('Group ' + group.name + ' exists'));
      redis.hmset(key, group, callback);
  });
}

/**
 * message:
 *
 *    text: text
 *    sender: 
 *    topicid: topicid
 *    userid: userid
 *
 */
exports.newMessage = function(message, callback) {

  redis.incr(MESSAGEID, function(err, msgid) {
      if(err) return callback(err);
      var key = MSG_ + msgid;
      var topicid = message.topicid;
      message.id = msgid;
      redis.multi()
        .hmset(key, message)
        .zadd(MESSAGE_LINE_ + topicid);
        .zadd(TOPIC_UPDATELINE_ + topicid, Date.now())
        .exec(callback);

      redis.publish(CHANNEL_ + TOPIC_ + topicid, JSON.stringify(message));
  });
}

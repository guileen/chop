module.exports = function(app) {
  var io = require('socket.io').listen(app);
  var service = require('../lib');

  io.sockets.on('connection', function(socket){
      var handler = new Handler(socket);
      socket.on('message', function(data){
          handler[data[0]](data[1]);
      });

      socket.on('disconnect', function(){
          handler.unsuball();
      });
  });
}

var TOPIC_ = 'topic:'
  , GROUP_ = 'group:'
  ;

function removeFromArr(arr, elem) {
    var index = arr.indexOf(elem);
    if(index >= 0) {
      arr.splice(index, 1);
    }
}

function Handler(socket) {
  this.socket = socket;
  var session = socket.request.session;
  // TODO ...
  console.log(session);
  this.username = session.username;
  this.channels = [];
}

// client message listeners
Handler.prototype = {

  sub: function(topicid) {
    var channel = getTopicChannel(topicid);
    channel.sub(this);
    this.channels.push(channel);
  }

, unsub: function(topicid) {
    getTopicChannel(topicid)
    channel.unsub(this);
    removeFromArr(this.channels, channel);
  }

, leave: function(groupid) {
    var channel = getGroupChannel(groupid);
    channel.broadcast(['leave', this.username]);
    channel.unsub(this);
    removeFromArr(this.channels, channel);

    // FIXME remove only channels of current group
    this.unsuball();
  }

, enter: function(groupid) {
    var channel = getGroupChannel(groupid);
    channel.broadcast(['enter'], this.username);
    channel.sub(this);
    this.channels.push(channel);
  }

, msg: function(data) {
    service.newMessage(data);
    getTopicChannel(data.topicid).broadcast(['msg', data]);
  }

, unsuball: function() {
    var self = this;
    this.channels.forEach(function(channel) {
        channel.unsub(self);
    })
  }

}

// ---- channels
var channels = {};

var getChannel = exports.getChannel = function getChannel(key) {
  return channels[key] || (channels[key] = new Channel(key));
}

var getTopicChannel = exports.getTopicChannel = function(topicid) {
  return getChannel(TOPIC_ + topicid);
}

var getGroupChannel = exports.getGroupChannel = function(groupid) {
  return getChannel(GROUP_ + groupid);
}

// FIXME for multi process
function Channel(key) {
  this.clients = [];
}

Channel.prototype = {

  sub: function(socket) {
    this.clients.push(socket);
  }

, unsub: function(socket) {
    removeFromArr(this.clients, socket);
  }

, broadcast: function(message) {
    this.clients.forEach(function(client) {
        client.emit('message', ['msg', message]);
    });
  }

}


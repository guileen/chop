var connect = require('connect')
  , parseCookie = connect.utils.parseCookie
  , Session = connect.middleware.session.Session
  , service = require('../lib');

var exports = module.exports = function(app) {
  var io = require('socket.io').listen(app);


  io.set('authorization', function (data, accept) {
      if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['connect.sid'];
        // save the session store to the data object
        // (as required by the Session constructor)
        data.sessionStore = app.sessionStore;
        console.log(data.sessionID);
        data.sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
              accept('Error', false);
            } else {
              // create a session object, passing data as request and our
              // just acquired session data
              data.session = new Session(data, session);
              accept(null, true);
            }
        });
      } else {
        return accept('No cookie transmitted.', false);
      }
  });

  io.sockets.on('connection', function(socket){
      var handler = new Handler(socket);
      socket.on('message', function(data){
          console.log('message');
          console.log(data);
          handler[data[0]](data[1]);
      });

      socket.on('disconnect', function(){
          handler.unsuball();
          clearInterval(intervalID);
      });

      var hs = socket.handshake;

      // setup an inteval that will keep our session fresh
      var intervalID = setInterval(function () {
          // reload the session (just in case something changed,
          // we don't want to override anything, but the age)
          // reloading will also ensure we keep an up2date copy
          // of the session with our connection.
          hs.session.reload( function () { 
              // "touch" it (resetting maxAge and lastAccess)
              // and save it back again.
              hs.session.touch().save();
          });
      }, 60 * 1000);

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
  this.session = socket.handshake.session;
  // TODO ...
  this.username = this.session.username;
  this.channels = [];
}

// client message listeners
Handler.prototype = {

  sub: function(topicid) {
    var channel = getTopicChannel(topicid);
    channel.sub(this.socket);
    this.channels.push(channel);
  }

, unsub: function(topicid) {
    getTopicChannel(topicid)
    channel.unsub(this.socket);
    removeFromArr(this.channels, channel);
  }

, leave: function(groupid) {
    var channel = getGroupChannel(groupid);
    channel.broadcast(['leave', this.username]);
    channel.unsub(this.socket);
    removeFromArr(this.channels, channel);

    // FIXME remove only channels of current group
    this.unsuball();
  }

, enter: function(groupid) {
    console.log('enter %s', groupid);
    console.log(this.username)
    var channel = getGroupChannel(groupid);
    channel.broadcast(['enter', this.username]);
    channel.sub(this.socket);
    this.channels.push(channel);
    service.userAddToGroup(groupid, this.username)
  }

, msg: function(data) {
    service.newMessage(data);
    getTopicChannel(data.topicid).broadcast(['msg', data]);
  }

, unsuball: function() {
    // TODO leave
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
    if(this.clients.indexOf(socket) < 0) {
      this.clients.push(socket);
    }
  }

, unsub: function(socket) {
    removeFromArr(this.clients, socket);
  }

, broadcast: function(message) {
    console.log('broadcast message %j', message);
    console.log('clients %d', this.clients.length);
    this.clients.forEach(function(client) {
        client.emit('message', ['msg', message]);
    });
  }

}


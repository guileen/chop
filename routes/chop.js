module.exports = function(app) {
  var io = require('socket.io').listen(app);

  io.sockets.on('connection', function(socket){
      socket.on('message', function(data){
          var handler = new Handler(socket);
          handler[data[0]](data[1]);
      });

      socket.on('disconnect', function(){

      });
  });
}

function Handler(socket) {
  this.socket = socket;
}

Handler.prototype = {

  getUser: function(data) {
    // this is socket

  }

, sub: function(data) {

  }

, unsub: function(data) {

  }

, pub: function(data) {

  }

}

;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

  var socket = null;

  Chop.connect = function(){
    socket = Chop.socket = io.connect('http://localhost:3000');
    socket.on('message', function (data) {
        listeners[data[0]](data[1]);
    });
  }

  // send command
  ;['sub', 'unsub', 'leave', 'enter', 'msg'].forEach(function(cmd) {
      Chop[cmd] = function(data) {
        socket.emit('message', [cmd, data]);
      }
  });

  // socket listeners
  var listeners = {

    msg: function(data) {
      console.log('msg:');
      console.log(data);
    }

    // newtopic
  , topic: function(data) {
      console.log('topic:');
      console.log(data);
    }

  , enter: function(data) {
      console.log('enter:');
      console.log(data);
    }

  , leave: function(data) {
      console.log('leave:');
      console.log(data);
    }

  }

})(this);

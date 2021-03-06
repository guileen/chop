;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

  var socket = null;

  Chop.connect = function(){
    socket = Chop.socket = io.connect('');
    socket.on('message', function (data) {
        console.log(data);
        listeners[data[0]](data[1]);
    });
  }

  Chop.io = {}

  // send command
  ;['sub', 'unsub', 'leave', 'enter', 'msg'].forEach(function(cmd) {
      Chop.io[cmd] = function(data) {
        console.log('client request io');
        console.log(cmd, data)
        socket.emit('message', [cmd, data]);
      }
  });

  // socket listeners
  var listeners = {

    msg: function(data) {
      Chop.showMessage(data);

    }

    // newtopic
  , topic: function(data) {
      console.log('topic:');
      
      Chop.showNewTopic(data);
    }

  , enter: function(data) {
      console.log('enter:');
      var user={
        username : data

      }
      Chop.showUserlist([user])
    }

  , leave: function(data) {
      console.log('leave:');
      console.log(data);
    }

  }

})(this);

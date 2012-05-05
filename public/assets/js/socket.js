;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

  var socket = null;

  Chop.connect = function(){
    socket = Chop.socket = io.connect('');
    socket.on('message', function (data) {
        listeners[data[0]](data[1]);
    });
  }

  Chop.io = {}

  // send command
  ;['sub', 'unsub', 'leave', 'enter', 'msg'].forEach(function(cmd) {
      Chop.io[cmd] = function(data) {
        socket.emit('message', [cmd, data]);
      }
  });

  // socket listeners
  var listeners = {

    msg: function(data) {
      console.log(data);

      var topicid=data.topicid;
      var domId="#topic-"+topicid;
      if ($(domId)[0]){
           var message= Chop.parseTemplate("message", data,$(domId+" topic-body"));
      }

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

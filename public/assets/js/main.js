
;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

	Chop.init = function(){
		Chop.msgbox=$(".msgbox textarea")[0];
		Chop.sendbox=$(".sendbox")[0];

		Chop.parseTemplate("topic", mock.topic, "#group-body");

		mock.message.forEach( function(m){
			Chop.parseTemplate("message", m, "#topic-"+m.topicid+" .topic-body");
		});


		$(".group-topic-inner").on("click", function(e){
			
			var target=e.target;
			if (target.className=="topic-footer"){
				var id=target.parentNode.id;
				Chop.activeBox(id);
			}
		});


		$(".msgbox textarea").on("keypress", function(e){
			if (e.keyCode==13){
				e.preventDefault();
				Chop.sendMsg( Chop.msgbox.value);
			}
		});


		$(".sendbutton button").on("click", function(e){
			Chop.sendMsg( Chop.msgbox.value );
		});

		groupTopic=$('.group-topic');
	}

	var groupTopic;
	Chop.activeBox=function(topicid){
		var topic=$('#'+topicid);
		var pos=topic.position();
		var scrollLeft=groupTopic.scrollLeft();

		console.log(scrollLeft)
		$(Chop.sendbox).css({
			left : (pos.left+scrollLeft)+"px"
		})
	}


	Chop.login=function(){

		$.post( '/api/login',
		   {
		      username : "fins",
		      password : "123123"
		   }
		);
	}

	Chop.signup=function(){
		
	}

	Chop.checkUsername=function(){
		
	}

	Chop.createGroup=function(){
		
	}

	Chop.removeGroup=function(){
		
	}

	Chop.sendMsg=function(msg){

		alert(msg);

		Chop.clearMsg();

	}


	Chop.clearMsg=function(msg){

		Chop.msgbox.value="";
		
	}






}(this));




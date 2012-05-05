
;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

	Chop.init = function(){

    // update profile
    Chop.profile();

		Chop.msgbox=$(".msgbox textarea")[0];
		Chop.sendbox=$(".sendbox")[0];

		var ts=mock.topic.reverse();
		ts.forEach( function(t){
			Chop.showNewTopic(t);
		});

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
			if (!e.ctrlKey && e.keyCode==13){
				e.preventDefault();
				Chop.sendMsg( Chop.msgbox.value);
			}
		});


		$(".sendbutton button").on("click", function(e){
			Chop.sendMsg( Chop.msgbox.value );
		});

		var groupMainDom=$(".group-main")[0];
		var groupTopicDom=$(".group-topic")[0];
		var groupPanel=$(".group-panel");
		var groupTool=$(".group-tool");

		var showPanel=true;

		function hidePanel(){
			groupPanel.hide();
			groupPanel.removeClass("group-aside-shadow");
			groupTool.addClass("group-aside-shadow");

			groupMainDom.style.paddingRight = "20px";
			groupMainDom.style.marginRight="1px"
			setTimeout(function(){
				groupMainDom.style.marginRight="0px";
			},0)
			showPanel=false;
		}
		function displayPanel(){
			groupPanel.show();
			groupTool.removeClass("group-aside-shadow");
			groupPanel.addClass("group-aside-shadow");

			var height=groupMainDom.style.height;
			groupMainDom.style.paddingRight = "200px";
			groupMainDom.style.marginRight="1px"
			setTimeout(function(){
				groupMainDom.style.marginRight="0px";
			},0)
			showPanel=true;
		}
		hidePanel();
		$("#trigger-button").on("click",function(e){
			// alert(1)
			if (showPanel){
				hidePanel();

			}else{
				displayPanel();
			}

		})

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



	Chop.clearMsg=function(msg){

		Chop.msgbox.value="";
		
	}

	Chop.showNewTopic = function(topic){

		var topic= Chop.parseTemplate("topic", topic)[0];

		var gbody=$("#group-body")[0];
		gbody.insertBefore( topic, gbody.firstChild );

	}





}(this));




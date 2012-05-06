
;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

	var currentTopic=null;

	Chop.init = function(){

    // update profile
    Chop.profile();

    Chop.getHomeGroups();
    Chop.showHome();

		Chop.msgbox=$(".msgbox textarea");
		Chop.sendbox=$(".sendbox");
		$(".sendbox").hide();
		currentTopic=null;

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
				Chop.sendMsg( Chop.msgbox.val(), currentTopic);
			}
		});


		$(".sendbutton button").on("click", function(e){
			Chop.sendMsg( Chop.msgbox.val(), currentTopic );
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

			groupMainDom.style.paddingRight = "25px";
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
			groupMainDom.style.paddingRight = "245px";
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

	    $('a.creategroup').click(function(){
	        Chop.showCreateGroup();
	    })

	    $('a.gotohome').click(function(){
	        Chop.showHome();
	    })

	    $('a.createtopic').click(function(){
	       $("#create-topic-box").show();
	       $("#topic-title").focus();
	    })

	    Chop.ct=function(){
	    	var title=$("#topic-title").val();
	    	var groupid=$("#current-groupid").val();
	    	Chop.createTopics(title, groupid)
	    }


	    $('#cancel-topic-box').click(function(){
	    	$("#create-topic-box").hide();
	    });

		groupTopic=$('.group-topic');
	}

	var groupTopic;
	Chop.activeBox=function(topicid){

		var topic=$('#'+topicid);
		var pos=topic.position();
		var scrollLeft=groupTopic.scrollLeft();
		$(".sendbox").show();
		currentTopic=topicid.substring(6);
		// alert(pos.left+scrollLeft)
		Chop.sendbox.css({
			left : (pos.left+scrollLeft)+"px"
		})
		$(".sendbox textarea").focus();
	}



	Chop.clearMsg=function(msg){

		Chop.msgbox.val("");
		
	}

	Chop.showNewTopic = function(topic){
    if(topic.id == null) throw new Error('topicid is required');

		var $topic= Chop.parseTemplate("topic", topic)[0];

		var gbody=$("#group-body")[0];
		gbody.insertBefore( $topic, gbody.firstChild );

    Chop.io.sub(topic.id);
  }

  Chop.showUserlist=function(users){
  	users.forEach(function(user){
  		if (user){
    		var id="user-"+user.username;
	  		if ($('#'+id)[0]){
	  			return;
	  		}
  			var $topic= Chop.parseTemplate("userlist", user, '#userlist');
			
  		}
  		
  	})
  }

  Chop.showNewGroup = function(group) {
    var $group = Chop.parseTemplate('group', group);
    $('.homebody').append($group);
    $group.click(function(){
        Chop.enterGroup(group.name);
    })
  }

  function hideAll() {
    $('.homebody').hide();
    $('.mainbody').hide();
    $('.create-group-body').hide();
  }

  Chop.showHome = function() {
    hideAll();
    $('.homebody').show();
  }

  Chop.showCreateGroup = function() {
    hideAll();
    $('.create-group-body').show();
  }

  Chop.enterGroup = function(id) {
    hideAll();
    // TODO load group
    $('.mainbody').show();
    Chop.io.enter(id);
    Chop.getHotTopics(id);
    Chop.getGroupUsers(id);
    $('#current-groupid').val(id);
  }

  Chop.leaveGroup = function() {

  }

}(this));




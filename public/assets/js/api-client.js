
;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};


	Chop.login=function(username, password){

		$.ajax( {
				url : '/api/login',
				type : 'post',
				data : {
			      username : username ,
			      password : password
			   	},
				success: function(data, textStatus, jqXHR){

				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);
	}

	Chop.logout=function(username, password){

		$.ajax( {
				url : '/api/logout',
				type : 'post',
				data : {
			     
			   	},
				success: function(data, textStatus, jqXHR){

				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);
	}

	Chop.signup=function(username, password){
		$.ajax( 
			{
				url : '/api/signup',
				type : 'post',
				data : {
			      username : username ,
			      password : password
			   	},
				success: function(data, textStatus, jqXHR){
					
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);
	}

  Chop.profile = function() {
    $.ajax({
        url: '/api/profile',
        type: 'post',
        success: function(data, textStatus, jqXHR) {
          console.log(data)
          $('a.userid').html(data.username);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          location.href= '/login'
        }
    });
  }

	Chop.checkUsername=function(){
		
	}

	Chop.createGroup=function(name, tags){
		$.ajax( 
			{
				url : '/api/group/create',
				type : 'post',
				data : {
			      name : name ,
			      tags : tags
			   	},
				success: function(data, textStatus, jqXHR){
					
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	}

	Chop.removeGroup=function(id){
		
	}

  Chop.getHomeGroups = function() {
    $.ajax({
        url: '/api/homegroups',
        type: 'get',
        success: function(data, textStatus, jqXHR) {
          data.data.forEach(function(group){
              Chop.showNewGroup(group);
          })
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
  }

	Chop.getHotTopics=function(groupid){

		$.ajax( 
			{
				url : '/api/group/hottopics',
				type : 'post',
				data : {
			      groupid : groupid
			   	},
				success: function(data, textStatus, jqXHR){
          var topics = data.data;
          // TODO only top 4 topics
          topics.forEach(function(topic){
              Chop.showNewTopic(topic);
          })
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.createTopics=function(title,groupid){
		$.ajax( 
			{
				url : '/api/group/newtopic',
				type : 'post',
				data : {
			      title : title,
			      groupid : groupid
			   	},
				success: function(data, textStatus, jqXHR){
					Chop.showNewTopic(data.data);
					$("#create-topic-box").hide();
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.getJoinedTopics=function(){

		$.ajax( 
			{
				url : '/api/group/joinedtopics',
				type : 'post',
				data : {
			      groupid : groupid
			   	},
				success: function(data, textStatus, jqXHR){
					
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.getTimelineTopics=function(startTime, endTime){

		$.ajax( 
			{
				url : '/api/group/timeline',
				type : 'post',
				data : {
			      startTime : startTime,
			      endTime : endTime,
			   	},
				success: function(data, textStatus, jqXHR){
					
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.getGroupUsers=function(groupid){

		$.ajax( 
			{
				url : '/api/group/users',
				type : 'post',
				data : {
			      groupid : groupid
			   	},
				success: function(data, textStatus, jqXHR){
					console.log(data)
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.sendMsg=function(text,topicid){
    if(topicid == null) {
      throw new Error('topicid is ' + topicid);
    }
		$.ajax( 
			{
				url : '/api/sendmsg',
				type : 'post',
				data : {
			      topicid : topicid ,
			      text : text
			   	},
				success: function(data, textStatus, jqXHR){
		          console.log(data)
					Chop.clearMsg();
				},
				error: function(jqXHR, textStatus, errorThrown){
					 console.log([textStatus,errorThrown])
				}
			}
		);

	}




}(this));

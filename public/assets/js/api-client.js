
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

	Chop.getHotTopics=function(groupid){

		$.ajax( 
			{
				url : '/api/group/hottopics',
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
					
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);		
	};

	Chop.sendMsg=function(text,topicid){

		$.ajax( 
			{
				url : '/api/sendmsg',
				type : 'post',
				data : {
			      topicid : topicid ,
			      text : text
			   	},
				success: function(data, textStatus, jqXHR){
					Chop.clearMsg();
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
			}
		);

	}




}(this));
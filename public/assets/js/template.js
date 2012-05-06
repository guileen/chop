
;(function(scope){
	var Chop=scope.Chop=scope.Chop||{};

/*
 *    text: text
 *    sender: 
 *    topicid: topicid
 *    userid: userid
 */

	Chop.template={

		topic : ([
				'<div class="topic" id="topic-${id}"  >	\
					<div class="topic-header" id="topic-head-${id}">${title}</div>	\
					<div class="topic-body">	\
					</div>	\
					<div class="topic-footer">	\
					</div>	\
				</div>'
			]).join(""),

		userlist : ([
				'<div class="list-item" >${username}</div> \
				'
			]).join(""),

		message : ([
				'<div class="message">	\
					<span class="sender" id="user-${userid}">${sender}</span>	\
					<div class="sendtime">${datetime}</div>	\
					<div class="text">${text}</div>	\
				</div>'
			]).join(""),

		group : ([
			'<div  class="group-icon" name="${name}">	\
          			<img src="${logo}" width="128" height="128"> \
					<div class="text"><a href="javascript:void(0)">${name}</a></div>	\
			</div>'

			]).join(""),


	}

	Chop.parseTemplate=function(tmpId , data, parent){

		var tmpl=Chop.template[tmpId];
		var jdom=null;

		if (tmpl){
			jdom=$.tmpl(tmpl, data);
			if (parent){
				jdom.appendTo( parent);
			}
		}

		return jdom;

	}

}(this));

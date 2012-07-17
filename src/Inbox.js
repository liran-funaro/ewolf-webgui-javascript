var Inbox = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
	
	var titleDiv = $("<div/>").attr({
		"class" : "eWolfTitle"
	})	.append("Inbox")
		.appendTo(frame);
	
	$("<input/>").attr({
		"type": "button",
		"value": "New Message...",
		"class": "newMessageBotton"
	}).appendTo(titleDiv).click(function() {
		new NewMessageBox("__newmessage__"+id,frame);
	});
	
	new InboxList(request,{}).appendTo(frame);
	
	return {
		getId : function() {
			return id;
		},
		isSelected : function() {
			return appContainer.isSelected();
		},
		destroy : function() {
			eWolf.unbind("refresh."+id);
			appContainer.destroy();
			delete this;
		}
	};
};

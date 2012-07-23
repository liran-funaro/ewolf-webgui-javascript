var Inbox = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
	
	new TitleArea("Inbox")
		.appendTo(frame)
		.addFunction("New Message...", function() {
			var box = new NewMessageBox(id,applicationFrame);
			box.select();
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

var Inbox = function (id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
	
	new TitleArea("Inbox")
		.appendTo(this.frame)
		.addFunction("New Message...", function() {
			new NewMessage(id,applicationFrame).select();
		});
	
	new InboxList(request,{}).appendTo(this.frame);
	
	return this;
};

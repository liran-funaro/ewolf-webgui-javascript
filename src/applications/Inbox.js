var Inbox = function (id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	new TitleArea("Inbox")
		.appendTo(this.frame)
		.addFunction("New Message...", function() {
			new NewMessage(id,applicationFrame).select();
		});
	
	new InboxList(id,{}).appendTo(this.frame);
	
	return this;
};

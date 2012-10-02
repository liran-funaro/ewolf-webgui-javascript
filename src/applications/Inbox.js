var Inbox = function (id,applicationFrame) {
	Application.call(this, id, applicationFrame, "Inbox");
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/		
	this.title.addFunction("New Message...", function() {
			new NewMessage(id,applicationFrame).select();
		});
	
	this.inbox = new InboxList(id,{}).appendTo(this.frame);
	
	return this;
};

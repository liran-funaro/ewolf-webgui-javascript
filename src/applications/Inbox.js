var Inbox = function (id,applicationFrame) {
	/****************************************************************************
	 * Base class
	  ***************************************************************************/	
	Application.call(this, id, applicationFrame, "Inbox");
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.inbox = new InboxList(id).appendTo(this.frame);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/		
	this.title.addFunction("New Message...", function() {
			new NewMessage(id,applicationFrame).select();
		});
	
	return this;
};

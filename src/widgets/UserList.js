var UserList = function(users, width, 
		actionText, actionContextInflator, actionContextWidth) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	var inlated = false;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.context = $("<div/>")
				.css("width",width + "px");
	
	this.userListContext = $("<div/>")
				.addClass("userListContextSide")
				.css("width",width + "px")		
				.appendTo(this.context);
	
	this.actionContext = $("<div/>")
				.addClass("userListActionContextSide")
				.css("width",actionContextWidth + "px")
				.appendTo(this.context).hide();
	
	this.userList = $("<ul/>")
				.addClass("userListClass")
				.appendTo(this.userListContext);
		
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.addUser = function(id) {
		var listItem = $("<li/>")
					.appendTo(self.userList);
		
		var leftSide = $("<div/>")
					.addClass("userListTextItem")					
					.appendTo(listItem);
		
		$("<div/>").append(CreateUserBox(id,null,false)).appendTo(leftSide);
		$("<div/>").addClass("idBox").append(id).appendTo(leftSide);
		
		$("<div/>")
				.addClass("userListActionItem")
				.addClass("aLink")
				.appendTo(listItem)
				.append(actionText)
				.click(function () {
					var inflator = actionContextInflator(id);
					
					if(inflator) {
						if(!inlated) {
							inlated = true;
							
							self.context.animate({
								width : width + actionContextWidth + 2
							},300, function() {
								self.actionContext.html(inflator).show().animate({
									opacity : 1
								},200);
							});
						} else {
							self.actionContext.animate({
								opacity : 0
							},200, function() {
								self.actionContext.html(inflator).animate({
									opacity: 1
								},200);
							}); 
						}
					}					
				});
	};
	
	$.each(users, function(i, id) {
		self.addUser(id);
		self.addUser(id);
		self.addUser(id);
	});
	
	return this;
};
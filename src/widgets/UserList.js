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
	this.addUser = function(userID) {
		var listItem = $("<li/>")
					.appendTo(self.userList);
		
		var leftSide = $("<div/>")
					.addClass("userListTextItem")					
					.appendTo(listItem);
		
		$("<div/>")
				.append(CreateUserBox(userID))
				.appendTo(leftSide);
		
		$("<div/>")
				.addClass("idBox")
				.append(userID)
				.appendTo(leftSide);
		
		$("<div/>")
				.addClass("userListActionItem")
				.addClass("aLink")
				.appendTo(listItem)
				.append(actionText)
				.click(function () {
					self.inflateContext(userID);
				});
	};
	
	this.inflateContext = function(userID) {
		var inflator = actionContextInflator(userID);
		
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
	};
	
	$.each(users, function(i, id) {
		self.addUser(id);
	});
	
	return this;
};
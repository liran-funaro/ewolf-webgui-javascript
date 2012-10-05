var PendingApprovalList = function(users, width) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.context = $("<div/>");
	
	this.profileList = $("<div/>")
				.addClass("profileListSide")
				.css("width",width + "px")		
				.appendTo(this.context);
	
	this.addList = $("<div/>")
				.addClass("addToWolfpackWidgetSide")
				.appendTo(this.context).hide();
	
	this.list = $("<ul/>")
				.addClass("cleanList")
				.appendTo(this.profileList);
		
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.addUser = function(id) {
		var listItem = $("<li/>")
					.addClass("pendingListItem")
					.appendTo(self.list);
		
		var leftSide = $("<div/>")
					.addClass("pendingListItemLeftSideItem")					
					.appendTo(listItem);
		
		$("<div/>").append(CreateUserBox(id,null,false)).appendTo(leftSide);
		$("<div/>").addClass("idBox").append(id).appendTo(leftSide);
		
		$("<div/>")
				.addClass("actionItem")
				.addClass("aLink")
				.appendTo(listItem)
				.append("add >>")
				.click(function () {
					var widget = new AddToWolfpack(null, id, [eWolf.APPROVED_ME_WOLFPACK_NAME]);
					
					if(self.addList.html() != "") {
						self.addList.animate({
							opacity : 0
						},200, function() {
							self.addList.html(widget.context).animate({
								opacity: 1
							},200);
						}); 
					} else {
						self.addList.html(widget.context).show(500);
					}
				});
	};
	
	$.each(users, function(i, id) {
		self.addUser(id);
	});
	
	return this;
};
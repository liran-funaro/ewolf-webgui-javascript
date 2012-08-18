var Logout = function(text,container) {
	var self = this;	
	this.frame =$("<div/>").attr({
		"class": "logoutLink aLink"
	})	.text(text)
		.appendTo(container)
		.click(function() {
			// TODO: logout
			eWolf.sendToProfile = {
					userID: "THIS IS AN ERROR"
			};
			
			$(window).unbind('hashchange');
			window.location.hash = "";
			document.location.reload(true);
		});
	
	this.destroy = function() {
		if(self.frame != null) {
			self.frame.remove();
			self.frame = null;
			delete self;
		}
	};
	
	return this;
};


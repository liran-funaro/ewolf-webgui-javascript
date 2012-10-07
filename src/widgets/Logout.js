var Logout = function(id,text,container) {
	var self = this;	

	this.frame =$("<div/>").attr({
		"class": "logoutLink aLink"
	})	.text(text)
		.appendTo(container)
		.click(function() {
			$(window).unbind('hashchange');
			window.location.hash = "";
			
			self.commitLogout();			
		});
	
	function onLogout(appID) {
		document.location.reload(false);
	}
	
	this.commitLogout = function () {
		eWolf.serverRequest.request(id,{
				logout : {}
			}, null , onLogout);
	};
	
	this.destroy = function() {
		if(self.frame != null) {
			self.frame.remove();
			self.frame = null;
			delete self;
		}
	};
	
	return this;
};


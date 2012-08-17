var MenuMessage = function(text,container) {
	var thisObj = this;	
	var message = null;
	
	this.show = function() {
		if(message == null) {
			message = $("<div/>").attr({
				"class": "menuItemMessageClass"
			}).text(text).appendTo(container);
		} else {
			message.show();
		}
	};
	
	this.hide = function() {
		if(message != null) {
			message.remove();
			message = null;
		}
	};
	
	this.destroy = function() {
		if(message != null) {
			message.remove();
			message = null;
			delete thisObj;
		}
	};
	
	return this;
};


var MenuMessage = function(id,itemclass,text,container) {
	var message = null;
	
	return {
		show : function() {
			if(message == null) {
				message = $("<div/>").attr({
					"id": id,
					"class": itemclass
				}).text(text).appendTo(container);
			} else {
				message.show();
			}
		},
		hide : function() {
			if(message != null) {
				message.remove();
				message = null;
			}
		},
		destroy : function() {
			if(message != null) {
				message.remove();
				message = null;
				delete this;
			}
		}
	};
};


var AppContainer = function(id,container) {
		var selected = false;
		var needRefresh = true;
		
		var frame = $("<div/>").attr({
			"id": id+"ApplicationFrame"
		})	.hide()
			.appendTo(container);
		
		eWolf.bind("select."+id,function(event,eventId) {
			if(id == eventId) {
				frame.slideDown(700);
				selected = true;
				if(needRefresh) {
					eWolf.trigger("refresh."+id,[id]);
				}
			} else {
				frame.slideUp(700);
				selected = false;
			}			
		});
		
		eWolf.bind("refresh."+id,function(event,eventId) {	
			if(id == eventId) {
				needRefresh = false;
			}
		});
		
		eWolf.bind("needRefresh."+id,function(event,eventId) {
			needRefresh = true;
			
			if(selected) {
				eWolf.trigger("refresh."+id,[id]);
			}
		});
		
		return {
			getFrame : function() {
				return frame;
			},
			getId : function() {
				return id;
			},
			isSelected : function() {
				return selected;
			},
			destroy : function() {
				eWolf.unbind("select."+id);
				frame.remove();
				delete this;
			}
		};
};
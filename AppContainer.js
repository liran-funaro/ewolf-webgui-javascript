var AppContainer = function(id,container) {
		var selected = false;
		var needRefresh = true;
		
		var frame = $("<div/>").attr({
			"id": id+"ApplicationFrame",
			"class": "applicationContainer"
		})	.appendTo(container)
			.hide(0);
		
		eWolf.bind("select."+id,function(event,eventId) {
			if(id == eventId) {				
				frame.show(0);
				frame.animate({
					opacity : 1,
				}, 700, function() {
				});
				
				selected = true;
				if(needRefresh) {
					eWolf.trigger("refresh",[id]);
				}
			} else {
				frame.animate({
					opacity : 0,
				}, 300, function() {
					frame.hide(0);
				});
				
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
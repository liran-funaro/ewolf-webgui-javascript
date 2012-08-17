var Application = function(id,container) {
	var self = this;
	var selected = false;
	var needRefresh = true;
	
	this.frame = $("<div/>").attr({
		"id": id+"ApplicationFrame",
		"class": "applicationContainer"
	})	.appendTo(container)
		.hide();
	
	eWolf.bind("select."+id,function(event,eventId) {
		if(id == eventId) {	
			if(!selected) {
				self.frame.show(0);
				self.frame.animate({
					opacity : 1,
				}, 700, function() {
				});
				
				selected = true;
			}
			
			if(needRefresh) {
				eWolf.trigger("refresh",[id]);
			}
		} else {
			if(selected) {
				self.frame.animate({
					opacity : 0,
				}, 300, function() {
					self.frame.hide(0);
				});
				
				selected = false;
			}				
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
			eWolf.trigger("refresh."+id.replace("+","\\+"),[id]);
		}
	});
	
	
	this.getFrame = function() {
		return self.frame;
	};
	
	this.getId = function() {
		return id;
	};
	
	this.isSelected = function() {
		return selected;
	};
	
	this.destroy = function() {
		eWolf.unbind("select."+id);
		eWolf.unbind("refresh."+id);
		eWolf.unbind("needRefresh."+id);
		self.frame.remove();
		delete self;
	};
	
	return this;
};
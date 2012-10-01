var Application = function(id,container) {
	var self = this;
	var selected = false;
	
	this.frame = $("<div/>")
			.addClass("applicationContainer")
			.appendTo(container)
			.hide();
	
	eWolf.bind("select."+id,function(event,eventId) {
		if(id == eventId) {	
			self.doSelect();
		} else {
			self.doUnselect();
		}			
	});
	
	eWolf.bind("destroy."+id,function(event,eventId) {
		self.destroy();
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
	
	this.select = function() {
		eWolf.trigger("select",[id]);
		return self;
	};
	
	this.doSelect = function() {
		if(!selected) {
			self.frame.show(0);
			self.frame.animate({
				opacity : 1,
			}, 700, function() {
			});
			
			selected = true;
		}
		return self;
	};
	
	this.doUnselect = function() {
		if(selected) {
			self.frame.animate({
				opacity : 0,
			}, 300, function() {
				self.frame.hide(0);
			});
			
			selected = false;
			
			self.frame.stopAllYouTubePlayers();
		}	
		return self;
	};
	
	this.destroy = function() {
		eWolf.unbind("select."+id);
		eWolf.unbind("destroy."+id);
		self.frame.remove();
		eWolf.serverRequest.unregisterApp(id);
		delete self;
	};
	
	return this;
};
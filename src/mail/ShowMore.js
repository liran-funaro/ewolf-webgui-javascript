var ShowMore = function (onClick) {
	var self = this;
	var element = null;
	
	this.draw = function () {
		element = $("<div/>").addClass("showMoreClass")
			.append("Show More...")
			.click(onClick);
		
		return self;
	};
	
	this.remove = function() {
		if(element != null) {
			element.remove();
			element = null;
		}
		
		return self;
	};
	
	this.show = function () {
		if(element) {
			element.show(200);
		}
		
		return self;
	};
	
	this.hide = function () {
		if(element) {
			element.hide(200);
		}
		
		return self;
	};
	
	this.appendTo = function (something) {
		if(element) {
			element.appendTo(something);
		}
		
		return self;
	};
	
	self.draw();
	
	return this;
};
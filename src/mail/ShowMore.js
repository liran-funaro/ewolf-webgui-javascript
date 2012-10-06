var ShowMore = function () {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	var element = $("<div/>")
			.addClass("showMoreClass")
			.append("Show More...");
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/		
	this.remove = function() {
		if(element != null) {
			element.remove();
			element = null;
			delete self;
		}
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
	
	this.setOnClick = function(newOnClick) {
		if(newOnClick && element) {
			element.click(newOnClick);
		}
	};
	
	this.appendTo = function (something) {
		if(element) {
			element.appendTo(something);
		}
		
		return self;
	};
	
	return this;
};
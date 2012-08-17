var ShowMore = function (frame,onClick) {
	var thisObj = this;
	var element = null;
	
	this.remove = function() {
		if(element != null) {
			element.remove();
		}
		
		return thisObj;
	};
	
	this.draw = function() {
		thisObj.remove();
		
		element = $("<div/>").addClass("showMoreClass")
			.append("Show More...")
			.click(onClick)
			.appendTo(frame);
		
		return thisObj;
	};
};
var ShowMore = function (frame,onClick) {
	var element = null;
	
	return {
		remove : function() {
			if(element != null) {
				element.remove();
			}
			
			return this;
		},
		draw : function() {
			this.remove();
			
			element = $("<div/>").attr({
				"class": "showMoreClass"
			}).append("Show More...").click(onClick);
			
			frame.append(element);
			
			return this;
		}
	};
};
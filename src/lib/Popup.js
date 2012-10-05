var Popup = function(frame, activator, align, width, offset) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var left = null,
			top = null;
	
	var $obj = $(activator);
	var objOffset = $obj.offset();
	var outerHeight = $obj.outerHeight();
	var outerWidth = $obj.outerWidth();
	var leftMargin = parseInt($obj.css("margin-left"));
	
	if(objOffset) {
		left = objOffset.left;
		top = objOffset.top;
	}
	
	if(offset) {
		left += offset.left;
		top += offset.top;
	}
	
//	if(!width) {
//		width = outerWidth;
//	}
	
	if(align.indexOf("bottom") == 0 && outerHeight) {
		top += outerHeight + leftMargin;
	}
	
	if(align == "bottom-left") {		
		
	} else if(align == "bottom-right") {
		left -= (width - outerWidth);
	} else if(align == "top-left") {
		left -= width;
	} else /* align == "bottom-right */{
		left += outerWidth;
	}
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.frame = $("<div/>").css({
			"position" : "absolute",
			"border": "1px solid #999",
			"background-color" : "white",
			"z-index" : "1000",
			"opacity" : "0.9"
	});
	
	this.frame.css({
		top : top + "px",
		left : left + "px",
		width : width + "px",
	});
	
	this.frame.appendTo(document.body).hide();
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	function clickFunc() {
		if(! self.frame.is(":hover")) {
			self.destroy();
		}
	};	
	
	this.destroy = function () {
		self.frame.hide(200,function() {
			self.frame.remove();
		});
		 $(document).unbind("click",clickFunc);
		 eWolf.unbind("select",self.destroy);
		 delete self;
	};
	
	this.start = function() {
		self.frame.show(200, function() {
			$(document).bind("click",clickFunc);
			eWolf.bind("select",self.destroy);
		});		
		return self;
	};
	
	this.append = function (item) {
		self.frame.append(item);
		return self;
	};
	
	return this;
};
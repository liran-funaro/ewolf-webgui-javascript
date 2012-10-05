var Notification = function(context, onItem, aboveItem, rightToItem) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	var currentNumber = 0;
		
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.notification = $("<span/>")
											.addClass("notification")
											.appendTo(context);
	
	if(onItem) {
		var pos = $(onItem).position(),
				width = $(onItem).outerWidth(),
				leftMargin = parseInt($(onItem).css("margin-left")),
				topMargin = parseInt($(onItem).css("margin-top"));
		
		self.notification.addClass("onItemNotification")
			.css({
		    top : (pos.top + topMargin - aboveItem) + "px",
		    left : (pos.left + width + leftMargin - 18 + rightToItem) + "px",
		});
	}
	
	this.notification.hide();
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.setCounter = function (number) {
		if(self.notification) {
			if(number > 0) {
				self.notification.html(number);
				
				if(currentNumber <= 0) {
					self.notification.show(300);
				}
			} else {
				if(currentNumber > 0) {
					self.notification.hide(300);
				}				
			}
		}
		
		currentNumber = number;
		
		return self;
	};
	
	this.getCounter = function() {
		return currentNumber;
	};
	
	return this;
};

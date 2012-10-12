var MenuItem = function(id,title) {
	var thisObj = this;
	var isLoading = false;
	var selected = false;	
	
	var listItem = $("<li/>");
		
	var aObj = $("<a/>").appendTo(listItem);
	
	var titleBox = $("<span/>").attr({
		"style": "width:1%;"
	}).appendTo(aObj);
	
	var refreshContainer = $("<div/>")
				.addClass("menuItemExtraInfoArea")
				.css("padding-top","3px")
				.appendTo(aObj).hide();
	
	var loadingContainer = $("<div/>")
				.addClass("menuItemExtraInfoArea")
				.css("padding-top","5px")
				.appendTo(aObj).hide();
	
	var notificationsContainer = $("<div/>")
				.addClass("menuItemExtraInfoArea")
				.appendTo(aObj).hide();
	
	var refresh = $("<img/>").attr({
		"src": "refresh.svg",
		"class": "refreshButton"
	})	.appendTo(refreshContainer);
	
	var notification = new Notification(notificationsContainer)
							.setCounter(0);
	
	listItem.click(function() {
		if(selected == false) {
			eWolf.selectApp(id);
		}	
	});

	refresh.click(function() {
		if(isLoading == false) {
			eWolf.trigger("refresh",[id]);
		}	
	});
	
	function updateView() {
		var w = 145;
		if(selected && !isLoading) {
			refreshContainer.show();
			w = w - 20;
		} else {
			refreshContainer.hide();
		}
		
		if(selected || isLoading) {
			notificationsContainer.hide();
		} else {
			notificationsContainer.show();
		}
		
		if(isLoading) {
			loadingContainer.show();
			w = w - 20;
		} else {
			loadingContainer.hide();
		}
		
		titleBox.text(title).shorten({width:w});
	}	
	
	function select() {
		aObj.addClass("currentMenuSelection");
		selected = true;
		updateView();
	}

	function unselect() {
		aObj.removeClass("currentMenuSelection");
		selected = false;
		updateView();
	}
	
	eWolf.bind("select",function(event,eventId) {
		if(id == eventId) {
			select();
		} else {
			unselect();
		}			
	});
	
	eWolf.bind("loading",function(event,eventId) {
		if(id == eventId) {
			isLoading = true;
			updateView();
			loadingContainer.spin(menuItemSpinnerOpts);
		}	
	});
	
	eWolf.bind("loadingEnd",function(event,eventId) {
		if(id == eventId) {
			isLoading = false;
			updateView();
			loadingContainer.data('spinner').stop();
		}
	});
	
	this.appendTo = function(place) {
		listItem.appendTo(place);
		updateView();
		return thisObj;
	};
	
	this.getId = function() {
		return id;
	};
	
	this.renameTitle = function(newTitle) {
		title = newTitle;
		updateView();
		return thisObj;
	};
	
	this.setNotificationCounter = function(number) {
		if(number < 0) {
			number = 0;
		}
		
		if(notification) {
			notification.setCounter(number);
		}
		
		return thisObj;
	};
	
	this.destroy = function() {
		listItem.remove();
		delete thisObj;
	};
	
	return this;
};

var menuItemSpinnerOpts = {
		  lines: 10, // The number of lines to draw
		  length: 4, // The length of each line
		  width: 2, // The line thickness
		  radius: 3, // The radius of the inner circle
		  rotate: 0, // The rotation offset
		  color: '#000', // #rgb or #rrggbb
		  speed: 0.8, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 0, // Top position relative to parent in px
		  left: 0 // Left position relative to parent in px
		};
var MenuItem = function(id,title,messageText,topbarFrame) {
	var thisObj = this;
	var isLoading = false;
	var selected = false;	
	var message = new MenuMessage(messageText,topbarFrame);
	
	var listItem = $("<li/>");
		
	var aObj = $("<a/>").appendTo(listItem);
	
	var titleBox = $("<span/>").attr({
		"style": "width:1%;"
	}).appendTo(aObj);
	
	var refreshContainer = $("<div/>").attr({
		"class": "refreshButtonArea"
	})	.appendTo(aObj).hide();
	
	var loadingContainer = $("<div/>").attr({
		"class": "refreshButtonArea",
		"id": id,
	})	.appendTo(aObj).hide();
	
	var refresh = $("<img/>").attr({
		"src": "refresh.svg",
		"class": "refreshButton"
	})	.appendTo(refreshContainer);
	
	listItem.click(function() {
		if(selected == false) {
			eWolf.trigger("select",[id]);
		}	
	});

	refresh.click(function() {
		if(isLoading == false) {
			eWolf.trigger("refresh."+id.replace("+","\\+"),[id]);
		}	
	});
	
	listItem.mouseover(message.show);
	listItem.mouseout(message.hide);
	
	function updateView() {
		var w = 145;
		if(selected && !isLoading) {
			refreshContainer.show();
			w = w - 20;
		} else {
			refreshContainer.hide();
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
	
	eWolf.bind("select."+id,function(event,eventId) {
		if(id == eventId) {
			select();
		} else {
			unselect();
		}			
	});
	
	eWolf.bind("loading."+id,function(event,eventId) {
		if(id == eventId) {
			isLoading = true;
			updateView();
			loadingContainer.spin(menuItemSpinnerOpts);
		}	
	});
	
	eWolf.bind("loadingEnd."+id,function(event,eventId) {
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
	
	this.destroy = function() {
		message.destroy();
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
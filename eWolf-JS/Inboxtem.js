var InboxItem = function(id,sender,timestamp,msg) {
	var isLoading = false;
	var preMessageTitle = ">> ";
	
	var itsMessage = null;
	
	var listItem = $("<li/>").attr({
		"id": id
	});
		
	var aObj = $("<a/>").appendTo(listItem);
	
	var preMessageBox = $("<span/>").attr({
		"id": id,
		"style": "width:1%;",
		"class": "preMessageBox"
	}).append(preMessageTitle).appendTo(aObj);
	
	var senderBox = $("<span/>").attr({
		"id": id,
		"style": "width:1%;"
	}).appendTo(aObj);
	
	var timestampBox = $("<span/>").attr({
		"id": id,
		"class": "timestampBox"
	}).append(timestamp).appendTo(aObj);
	
	var loadingContainer = $("<div/>").attr({
		"class": "refreshButtonArea",
		"id": id,
	})	.appendTo(aObj).hide();
	
	listItem.click(function() {		
		if(itsMessage == null) {
			itsMessage = $("<li/>").attr({
				 "id": id,
				 "class": "messageBox"
			 }).append(msg).insertAfter(listItem);;
		} else {
			itsMessage.toggle();
		}
	});
	
	function updateView() {
		var w = listItem.width()-timestampBox.width()-preMessageBox.width()-20;
		if(isLoading) {
			loadingContainer.show();
			w = w - 20;
		} else {
			loadingContainer.hide();
		}
		
		senderBox.text(sender).shorten({width:w});
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
	
	eWolf.bind("mainFrameResize", function(event,eventId) {
		updateView();
	});
	
	return {
		appendTo: function(place) {
			listItem.appendTo(place);
			updateView();
			return this;
		},
		prependTo: function(place) {
			listItem.prependTo(place);
			updateView();
			return this;
		},
		insertAfter: function(place) {
			listItem.insertAfter(place);
			updateView();
			return this;
		},
		getListItem : function() {
			return listItem;
		},
		getId : function() {
			return id;
		},
		destroy: function() {
			message.destroy();
			listItem.remove();
			delete this;
		}
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
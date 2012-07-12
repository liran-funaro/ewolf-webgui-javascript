var GenericItem = function(id,senderName,senderID,timestamp,msg,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	
	var dateFormat = "dd/MM/yyyy (HH:mm)";
	
	var itsMessage = null;
	
	var listItem = $("<li/>").attr({
		"id": id,
		"class": listClass
	});
	
	var preMessageBox = $("<span/>").attr({
		"id": id,
		"style": "width:1%;",
		"class": "preMessageBox"
	}).append(preMessageTitle).appendTo(listItem);
	
	
	var senderBox = new User(senderID,senderName).appendTo(listItem);
	
	var itsTime = new Date(timestamp);
	
	var timestampBox = $("<span/>").attr({
		"id": id,
		"class": "timestampBox"
	}).append(itsTime.toString(dateFormat)).appendTo(listItem);
	
	if(allowShrink) {
		listItem.click(function() {		
			toggleMessage();
		});
	}
	
	function toggleMessage() {
		if(itsMessage == null) {
			var msgBox = MailItem(JSON.parse(msg));
			itsMessage = $("<li/>").attr({
				 "id": id,
				 "class": msgBoxClass
			 }).append(msgBox).insertAfter(listItem);
		} else {
			itsMessage.toggle();
		}
	}	
	
	function updateView() {
		var w = listItem.width()-timestampBox.width()-preMessageBox.width()-20;		
		senderBox.text(senderName).shorten({width:w});
	}	
	
	eWolf.bind("mainFrameResize", function(event,eventId) {
		updateView();
	});
	
	return {
		appendTo: function(place) {
			listItem.appendTo(place);
			if(!allowShrink) {
				toggleMessage();
			}
			updateView();
			return this;
		},
		prependTo: function(place) {
			listItem.prependTo(place);
			if(!allowShrink) {
				toggleMessage();
			}
			updateView();
			return this;
		},
		insertAfter: function(place) {
			listItem.insertAfter(place);
			if(!allowShrink) {
				toggleMessage();
			}
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
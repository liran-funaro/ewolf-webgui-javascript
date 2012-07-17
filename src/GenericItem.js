var GenericItem = function(senderID,senderName,timestamp,mail,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	
	var dateFormat = "dd/MM/yyyy (HH:mm)";
		
	var itemSpan = $("<span/>");
	
	var listItem = $("<li/>").attr({
		"class": listClass
	}).appendTo(itemSpan);
	
	var preMessageBox = $("<span/>").attr({
		"style": "width:1%;",
		"class": "preMessageBox"
	}).append(preMessageTitle).appendTo(listItem);	
	
	var senderBox = new User(senderID,senderName).appendTo(listItem);
	
	var itsTime = new Date(timestamp);
	
	var timestampBox = $("<span/>").attr({
		"class": "timestampBox"
	}).append(itsTime.toString(dateFormat)).appendTo(listItem);
		
	var itsMessage = $("<li/>").attr({
		 "class": msgBoxClass
	 })	.append(MailItem(JSON.parse(mail)))
	 	.insertAfter(listItem);
	
	if(allowShrink) {
		itsMessage.hide();
		
		listItem.click(function() {		
			itsMessage.toggle();
		});
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
			itemSpan.appendTo(place);
			updateView();
			return this;
		},
		prependTo: function(place) {
			itemSpan.prependTo(place);
			updateView();
			return this;
		},
		insertAfter: function(place) {
			itemSpan.insertAfter(place);
			updateView();
			return this;
		},
		getListItem : function() {
			return itemSpan;
		},
		destroy: function() {
			message.destroy();
			itemSpan.remove();
			delete this;
		}
	};
	
	return this;
};
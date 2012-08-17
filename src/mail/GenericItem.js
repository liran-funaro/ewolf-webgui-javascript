var GenericItem = function(senderID,senderName,timestamp,mail,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	var thisObj = this;
	var itemSpan = $("<span/>");
	
	var listItem = $("<li/>").attr({
		"class": listClass
	}).appendTo(itemSpan);
	
	var preMessageBox = $("<span/>").attr({
		"style": "width:1%;",
		"class": "preMessageBox"
	}).append(preMessageTitle).appendTo(listItem);	
	
	var isOnSender = false;
	var senderBox = CreateUserBox(senderID,senderName)
		.appendTo(listItem)
		.hover(function() {
			isOnSender = true;
		}, function () {
			isOnSender = false;
		});
	
	
	var timestampBox = CreateTimestampBox(timestamp).appendTo(listItem);
		
	var itsMessage = $("<li/>").attr({
		 "class": msgBoxClass
	 })	.append(CreateMailItemBox(JSON.parse(mail)))
	 	.insertAfter(listItem);
	
	if(allowShrink) {
		itsMessage.hide();
		
		listItem.click(function() {		
			if(!isOnSender){
				itsMessage.toggle();
			}				
		});
	}	
	
	function updateView() {
		var w = listItem.width()-timestampBox.width()-preMessageBox.width()-20;		
		senderBox.text(senderName).shorten({width:w});
	}	
	
	eWolf.bind("mainFrameResize,refresh",function(event,eventId) {
		updateView();
	});
	
	this.appendTo = function(place) {
		itemSpan.appendTo(place);
		updateView();
		return thisObj;
	};
	
	this.prependTo = function(place) {
		itemSpan.prependTo(place);
		updateView();
		return thisObj;
	};
	
	this.insertAfter = function(place) {
		itemSpan.insertAfter(place);
		updateView();
		return thisObj;
	};
	
	this.getListItem = function() {
		return itemSpan;
	};
	
	this.destroy = function() {
		message.destroy();
		itemSpan.remove();
		delete thisObj;
	};
	
	return this;
};
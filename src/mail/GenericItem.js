var GenericItem = function(senderID,senderName,timestamp,mail,
		listClass,msgBoxClass,preMessageTitle,allowShrink) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	var isOnSender = false;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	var itemSpan = $("<span/>");
	
	var listItem = $("<li/>").attr({
		"class": listClass
	}).appendTo(itemSpan);
	
	var preMessageBox = $("<span/>").attr({
		"style": "width:1%;",
		"class": "preMessageBox"
	}).append(preMessageTitle).appendTo(listItem);		

	var senderBox = CreateUserBox(senderID,senderName)
				.appendTo(listItem)
				.hover(function() {
					isOnSender = true;
				}, function () {
					isOnSender = false;
				});	
	
	var timestampBox = CreateTimestampBox(timestamp)
				.appendTo(listItem);
		
	var itsMessage = $("<li/>")
				.addClass(msgBoxClass)
				.append(CreateMailItemBox(JSON.parse(mail)))
				.insertAfter(listItem);	
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
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
		return self;
	};
	
	this.prependTo = function(place) {
		itemSpan.prependTo(place);
		updateView();
		return self;
	};
	
	this.insertAfter = function(place) {
		itemSpan.insertAfter(place);
		updateView();
		return self;
	};
	
	this.getListItem = function() {
		return itemSpan;
	};
	
	this.destroy = function() {
		message.destroy();
		itemSpan.remove();
		delete self;
	};
	
	return this;
};
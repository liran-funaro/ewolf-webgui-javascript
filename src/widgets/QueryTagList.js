var QueryTagList = function(minWidth,queryPlaceHolder,availableQueries,
		allowMultipleDestinations,commitQuery) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.frame = $("<div/>").addClass("seachListClass");	
	var queryBox = $("<div/>").appendTo(this.frame);
	
	var query = $("<input/>").attr({
		"type": "text",
		"placeholder": queryPlaceHolder
	}).css({
		"min-width" : minWidth
	}).appendTo(queryBox);
	
	var addBtn = $("<input/>").attr({
		"type": "button",
		"value": "Add"
	}).click(function() {
		self.addTagByQuery(query.val(),true);
	}).appendTo(queryBox).hide();
	
	var errorBox = $("<div/>").addClass("errorArea").appendTo(queryBox).hide();

	this.tagList = new TagList(false,updateQuery).appendTo(this.frame);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	query.autocomplete({
		source: availableQueries,
		select: onSelectSendTo
	}).keyup(function(event) {
	    if(event.keyCode == 13 && query.val() != "") {
	    	self.addTagByQuery(query.val(),true);   	
	    } else {
	    	updateQuery();
	    	}	    
	});

	query.bind('input propertychange',function() {
		if(query.val() == "") {
			addBtn.hide(200);
		} else {
			addBtn.show(200);
		}
	});
	
	function onSelectSendTo(event,ui) {		
		self.addTagByQuery(ui.item.label,true);
		return false;
	}
	
	function updateQuery (id) {			
		if(!allowMultipleDestinations) {
			if(! self.tagList.isEmpty()) {
				queryBox.hide();
			} else {
				queryBox.show();
			}
		}
	}
		
	this.addTagByQuery = function(thisQuery,removable) {
		var res = commitQuery(thisQuery);
		// sould return:	res.term and res.display
		
		if(res == null) {
			return false;
		}
		
		if(self.tagList.addTag(res.term,res.term,res.display,removable)) {
				query.val("");
				addBtn.hide(200);
    		updateQuery();
    		self.isMissingField(false);
    		return true;
		} else {
			return false;
		}		
	};
	
	this.isMissingField = function (showError, errorMessage) {
		var fieldEmpty = self.tagList.match({removable:true}).isEmpty();
		
		errorBox.animate({
			"opacity" : "0"
		},500,function() {
			if(fieldEmpty && showError) {
				query.focus();
				errorBox.html(errorMessage);
				errorBox.show();
				
				errorBox.animate({
					"opacity" : "1"
				},1000);
				
				query.animate({
					"background-color" : "#debdbd"
				},1000);
			}
			
			if(!fieldEmpty) {
				query.animate({
					"background-color" : "#ddd"
				},1000);
				
				errorBox.hide();
			}
		});
		
		return fieldEmpty;
	};
	
	this.appendTo = function(someFrame) {
		this.frame.appendTo(someFrame);
		return this;
	};
	
	this.focus = function () {
		query.focus();
		return this;
	};
	
	return this;
};

var FriendsQueryTagList = function (minWidth) {
	function sendToFuncReplace(query) {
		var id = eWolf.members.getUserFromFullDescription(query);
		var name = null;
		
		if(id) {
			name = eWolf.members.getUserName(id);
		} else {
			id = query;
		}
		
		return {
			term: id,
			display: CreateUserBox(id,name)
		};
	}
	
	return new QueryTagList(minWidth,"Type friend name or ID...",
			eWolf.members.knownUsersFullDescriptionArray,true,sendToFuncReplace);
};

var WolfpackQueryTagList = function (minWidth) {
	function sendToFuncReplace(pack) {
		var idx = eWolf.wolfpacks.wolfpacksArray.indexOf(pack);
		if(idx != -1) {
			return {
				term: pack,
				display: CreateWolfpackBox(pack)
			};
		} else {
			return null;
		}		
	}
	
	return new QueryTagList(minWidth,"Type wolfpack name...",
			eWolf.wolfpacks.wolfpacksArray,false,sendToFuncReplace);
};
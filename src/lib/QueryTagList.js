var QueryTagList = function(minWidth,queryPlaceHolder,availableQueries,
		allowMultipleDestinations,commitQuery) {
	var thisObj = this;
	
	this.frame = $("<div/>").attr("class","seachListClass");	
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
		thisObj.addTagByQuery(query.val(),true);
	}).appendTo(queryBox).hide();
	
	query.autocomplete({
		source: availableQueries,
		select: onSelectSendTo
	}).keyup(function(event) {
	    if(event.keyCode == 13 && query.val() != "") {
	    	thisObj.addTagByQuery(query.val(),true);   	
	    } else {
	    	updateQuery();
	    }	    
	});
	
	function onSelectSendTo(event,ui) {		
		thisObj.addTagByQuery(ui.item.label,true);
		return false;
	}
	
	function updateQuery (id) {	
		if(query.val() == "") {
			addBtn.hide(200);
		} else {
			addBtn.show(200);
		}
		
		if(!allowMultipleDestinations) {
			if(! thisObj.tagList.match().isEmpty()) {
				queryBox.hide();
			} else {
				queryBox.show();
			}
		}
	}
	
	this.tagList = new TagList(false,updateQuery).appendTo(this.frame);
		
	this.addTagByQuery = function(thisQuery,removable) {
		var res = commitQuery(thisQuery);
		// sould return:	res.term and res.display
		
		if(res == null) {
			return false;
		}
		
		if(thisObj.tagList.addTag(res.term,res.term,res.display,removable)) {
			query.val("");
    		updateQuery();
    		return true;
		} else {
			return false;
		}		
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
		var id = eWolf.wolfpacks.getFriendID(query);
		
		if(id == null) {
			id = query;
			query = null;
		}
		
		return {
			term: id,
			display: CreateUserBox(id,query)
		};
	}
	
	return new QueryTagList(minWidth,"Type user name or ID...",
			eWolf.wolfpacks.friendsNameArray,true,sendToFuncReplace);
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
var QueryTagList = function(minWidth,queryPlaceHolder,availableQueries,commitQuery) {
	var thisObj = this;
	
	var box = $("<div/>").attr("class","seachListClass");
	
	var queryBox = $("<div/>").appendTo(box);
	this.tagList = new TagList(false).appendTo(box);
	
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
		thisObj.addTag(query.val(),true);
	}).appendTo(queryBox).hide();
	
	query.autocomplete({
		source: availableQueries,
		select: onSelectSendTo
	}).keyup(function(event) {
	    if(event.keyCode == 13 && query.val() != "") {
	    	addTagByQueryAndUpdate(query.val());   	
	    }
	    
	    if(query.val() == "") {
	    	addBtn.hide(200);
	    } else {
	    	addBtn.show(200);
	    }
	});
	
	function onSelectSendTo(event,ui) {		
		addTagByQueryAndUpdate(ui.item.label);
		return false;
	}
	
	function addTagByQueryAndUpdate(thisQuery) {
		if(thisObj.addTagByQuery(thisQuery,true) == true) {
    		query.val("");
    		addBtn.hide(200);
		}
	}
		
	this.addTagByQuery = function(thisQuery,removable) {
		var res = commitQuery(thisQuery);
		// sould return:	res.term and res.display
		
		if(res == null) {
			return false;
		}
		
		return thisObj.tagList.addTag(res.term,res.term,res.display,removable);
	};
	
	this.appendTo = function(someFrame) {
		box.appendTo(someFrame);
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
			display: new User(id,query)
		};
	}
	
	return new QueryTagList(minWidth,"Type user name or ID...",
			eWolf.wolfpacks.friendsNameArray,sendToFuncReplace);
};

var WolfpackQueryTagList = function (minWidth) {
	function sendToFuncReplace(pack) {
		var idx = eWolf.wolfpacks.wolfpacksArray.indexOf(pack);
		if(idx != -1) {
			return {
				term: pack,
				display: new Wolfpack(pack)
			};
		} else {
			return null;
		}		
	}
	
	return new QueryTagList(minWidth,"Type wolfpack name...",
			eWolf.wolfpacks.wolfpacksArray,sendToFuncReplace);
};
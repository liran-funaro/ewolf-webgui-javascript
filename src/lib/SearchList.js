var SearchList = function(minWidth,queryPlaceHolder,availableQueries,commitQuery) {
	var thisObj = this;
	
	var box = $("<div/>").attr("class","seachListClass");
	
	var queryBox = $("<div/>").appendTo(box);
	var tagBox = $("<div/>").appendTo(box);
	
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
	    if(event.keyCode == 13 && query.val() != ""){
	    	thisObj.addTag(query.val(),true);
	    	query.val("");
	    }
	    
	    if(query.val() == "") {
	    	addBtn.hide(200);
	    } else {
	    	addBtn.show(200);
	    }
	});
	
	function onSelectSendTo(event,ui) {		
		if(thisObj.addTag(ui.item.label,true) == true) {
			query.val("");
		}
		
		return false;
	}
		
	this.foreachTag = function (applyThis,withSelector) {
		var selector = ".TagClass";
		if(withSelector) {
			selector += withSelector;
		}
		
		tagBox.children(selector).each(function(i, thisTag) {
			applyThis($(thisTag).attr("id"));
		});
		
		return this;
	};
	
	this.foreachMarkedTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ".TagErrorClass");
	};
	
	this.foreachUnMarkedTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ":not(.TagErrorClass)");
	};
	
	this.foreachRemovableTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ":not(.TagNonRemoveable)");
	};
	
	this.removeTag = function (tag) {
		var tagElement = tagBox.children(".TagClass[id=\""+tag+"\"]");
		if(tagElement.length > 0) {
			tagElement.remove();
			return true;
		}
		
		return false;
	};
	
	this.addTag = function(thisQuery,removable) {
		var res = commitQuery(thisQuery);
		// sould return:	res.term and res.display
		
		if(res == null) {
			return false;
		}

		if(tagBox.find(".TagClass[id=\""+res.term+"\"]").length != 0) {
			return false;
		}		
		
		var newTagItem = new Tag(res.term,null,removable)
			.attr("id",res.term)
			.append(res.display);
		
		tagBox.append(newTagItem);
		
		query.val("");
		addBtn.hide(200);
		
		return true;
	};
	
	this.appendTo = function(someFrame) {
		box.appendTo(someFrame);
		return this;
	};
	
	this.markTag = function (tag,error) {
		tagBox.children(".TagClass[id=\""+tag+"\"]")
			.addClass("TagErrorClass")
			.attr("title",error);
		return this;
	};
	
	this.unmarkTag = function (tag) {
		tagBox.children(".TagClass[id=\""+tag+"\"]")
			.removeClass("TagErrorClass")
			.attr("title",null);
		return this;
	};
	
	this.isEmpty = function() {
		return (tagBox.children(".TagClass,.TagClass.TagErrorClass").length == 0);
	};
	
	this.tagCount = function() {
		return tagBox.children(".TagClass").length;
	};
	
	this.unmarkedTagCount = function() {
		return tagBox.children(".TagClass:not(.TagErrorClass)").length;
	};
	
	this.markedTagCount = function() {
		return tagBox.children(".TagClass.TagErrorClass").length;
	};
	
	this.removableTagCount = function () {
		return tagBox.children(".TagClass:not(.TagNonRemoveable)").length;
	};
	
	this.unmarkAll = function () {
		tagBox.children(".TagClass").removeClass("TagErrorClass");
		return this;
	};
	
	return this;
};

var FriendsSearchList = function (minWidth) {
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
	
	return new SearchList(minWidth,"Type user name or ID...",
			eWolf.wolfpacks.friendsNameArray,sendToFuncReplace);
};

var WolfpackSearchList = function (minWidth) {
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
	
	return new SearchList(minWidth,"Type wolfpack name...",
			eWolf.wolfpacks.wolfpacksArray,sendToFuncReplace);
};
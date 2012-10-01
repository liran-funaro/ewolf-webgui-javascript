SEARCHAPP_CONSTANTS = {
	SEARCH_PROFILE_PREFIX : "profile:",
	SEARCH_MENU_ITEM_ID : "__seach_menu_id__"
};

var SearchApp = function(menu,applicationFrame,container) {
	var self = this;
	$.extend(this,SEARCHAPP_CONSTANTS);
	
	var menuList = menu.createNewMenuList(this.SEARCH_MENU_ITEM_ID,"Search");
	var apps = new Object();
	var lastSearch = null;
	
	this.frame = $("<div/>")
		.addClass("title-bar")
		.appendTo(container);
	
	var query = $("<input/>").attr({
		"type" : "text",
		"placeholder" : "Search",
		"autocomplete" : "off",
		"spellcheck" : "false"
	}).css({
		"width" : "400px"
	}).autocomplete({
		source: eWolf.members.knownUsersFullDescriptionArray,
		select: onSelectAutocomplete
	}).appendTo(this.frame);
	
	eWolf.bind("foundNewUser",function(event,id,name,fullDescription) {
		query.autocomplete("destroy").autocomplete({
			source: eWolf.members.knownUsersFullDescriptionArray,
			select: onSelectAutocomplete
		});
	});
	
	function onSelectAutocomplete(event,ui) {
		self.search(ui.item.label);
		return false;
	}

	var searchBtn = $("<input/>").attr({
		"type" : "button",
		"value" : "Search"
	}).appendTo(this.frame).hide();
	
	function addSearchMenuItem(id,name) {
		var tempName;
		if(name == null) {
			tempName = "Search: " + id;
		} else {
			tempName = name;
		}
		
		var searchAppKey = self.SEARCH_PROFILE_PREFIX + id;
		menuList.addMenuItem(searchAppKey,tempName);
		apps[searchAppKey] = new Profile(searchAppKey,applicationFrame,id,name)
			.onReceiveName(function(newName) {
				menuList.renameMenuItem(searchAppKey,newName);
			});	
		
		eWolf.selectApp(searchAppKey);
	};
	
	function removeSearchMenuItem(searchKey) {
		var searchAppKey = self.SEARCH_PROFILE_PREFIX + searchKey;
		
		if(apps[searchAppKey] != null) {
			apps[searchAppKey].destroy();
			delete apps[searchAppKey];
			apps[searchAppKey] = null;
			menuList.removeMenuItem(searchAppKey);
		}
	}
	
	function removeLastSearch() {
		if(lastSearch != null) {
			removeSearchMenuItem(lastSearch);
			lastSearch = null;
		}
	}
	
	this.search = function (key,name) {
		if(key == null) {
			key = query.val();
		}
		
		if(name == "") {
			name == null;
		}
		
		if(key != null && key != "") {				
			if(!name) {
				name = eWolf.members.getUserName(key);
			}

			if(!name) {
				var fullDescID = eWolf.members.getUserFromFullDescription(key);
				
				if(fullDescID) {
					key = fullDescID;
					name = eWolf.members.getUserName(fullDescID);
				}
			}
			
			var searchAppKey = self.SEARCH_PROFILE_PREFIX + key;
			
			if(key == eWolf.profile.getID()) {
				eWolf.selectApp(eWolf.MYPROFILE_APP_ID);
			} else if(apps[searchAppKey] != null) {
				console.log("not deleted");
			} else {
				removeLastSearch();
				lastSearch = key;
				addSearchMenuItem(key,name);
			}			
		}
		
		return self;
	};
	
	searchBtn.click(function() {
		self.search(query.val());	
	});
	
	eWolf.bind("select",function(event,eventId) {
		var lastSearchAppKey = self.SEARCH_PROFILE_PREFIX + lastSearch;
		var lastSearchNewMailAppKey = NEWMAIL_CONSTANTS.NEWMAIL_APP_ID_PREFIX
			+ lastSearchAppKey;
		if(eventId != lastSearchAppKey && eventId != lastSearchNewMailAppKey) {
			removeLastSearch();
		}
	});
	
	query.bind('input propertychange',function() {
		 if(query.val() == "") {
	    	searchBtn.hide(200);
	    } else {
	    	searchBtn.show(200);
	    }
	});
	
	query.keyup(function(event){
	    if(event.keyCode == 13 && query.val() != ""){
//	    	if(event.shiftKey) {
//	    		addBtn.click();
//	    	} else {
//	    		searchBtn.click();
//	    	}
	    	
	    	searchBtn.click();
	    }   
	});
		
	
	eWolf.bind("search",function(event,key,name) {
		self.search(key,name);
	});
	
	return this;
};
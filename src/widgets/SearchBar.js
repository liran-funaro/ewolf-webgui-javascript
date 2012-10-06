var SearchBar = function(menu,applicationFrame,container) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	$.extend(this,SEARCHBAR_CONSTANTS);
	
	//var menuList = menu.createNewMenuList(this.SEARCH_MENU_ITEM_ID,"Search");
	var apps = new Object();
	var lastSearch = null;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/	
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
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	eWolf.bind("foundNewUser",function(event,id,name,fullDescription) {
		query.autocomplete("destroy").autocomplete({
			source: eWolf.members.knownUsersFullDescriptionArray,
			select: onSelectAutocomplete
		});
	});
	
	var searchBtn = $("<input/>").attr({
		"type" : "button",
		"value" : "Search"
	}).appendTo(this.frame).hide();
	

	function onSelectAutocomplete(event,ui) {
		self.search(ui.item.label);
		return false;
	}
	
	function addSearchMenuItem(id,name) {
//		var tempName;
//		if(name == null) {
//			tempName = "Search: " + id;
//		} else {
//			tempName = name;
//		}
//		
		var searchedProfileAppKey = self.SEARCH_PROFILE_PREFIX + id;
		//menuList.addMenuItem(searchedProfileAppKey,tempName);
		apps[searchedProfileAppKey] = new Profile(searchedProfileAppKey,applicationFrame,id,name)
			.onReceiveName(function(newName) {
				//menuList.renameMenuItem(searchedProfileAppKey,newName);
			});	
		
		eWolf.selectApp(searchedProfileAppKey);
	};
	
	function removeSearchMenuItem(searchKey) {
		var searchedProfileAppKey = self.SEARCH_PROFILE_PREFIX + searchKey;
		
		if(apps[searchedProfileAppKey] != null) {
			apps[searchedProfileAppKey].destroy();
			delete apps[searchedProfileAppKey];
			apps[searchedProfileAppKey] = null;
			//menuList.removeMenuItem(searchedProfileAppKey);
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
			
			var searchedProfileAppKey = self.SEARCH_PROFILE_PREFIX + key;
			
			if(key == eWolf.profile.getID()) {
				eWolf.selectApp(eWolf.MYPROFILE_APP_ID);
			} else if(apps[searchedProfileAppKey] != null) {
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
		var lastSearchedProfileAppKey = self.SEARCH_PROFILE_PREFIX + lastSearch;
		var lastSearchNewMailAppKey = NEWMAIL_CONSTANTS.NEWMAIL_APP_ID_PREFIX
			+ lastSearchedProfileAppKey;
		if(eventId != lastSearchedProfileAppKey && eventId != lastSearchNewMailAppKey) {
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
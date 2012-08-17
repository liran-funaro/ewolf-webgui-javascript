var SearchApp = function(menu,applicationFrame,container) {
	var self = this;
	
	var menuList = menu.createNewMenuList("search","Searches");
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
	}).appendTo(this.frame);

	var searchBtn = $("<input/>").attr({
		"type" : "button",
		"value" : "Search"
	}).appendTo(this.frame).hide();
	
	function addSearchMenuItem(key,name) {
		var tempName;
		if(name == null) {
			tempName = "Search: "+key;
		} else {
			tempName = name;
		}
		
		menuList.addMenuItem(key,tempName);
		apps[key] = new Profile(key,name,applicationFrame)
			.onReceiveName(function(newName) {
				menuList.renameMenuItem(key,newName);
			});	
		
		eWolf.trigger("select",[key]);
	};
	
	function removeSearchMenuItem(key) {
		if(apps[key] != null) {
			apps[key].destroy();
			delete apps[key];
			apps[key] = null;
			menuList.removeMenuItem(key);
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
		
		if(key != null && key != "") {
			if(key == eWolf.data("userID") || apps[key] != null) {
				eWolf.trigger("select",[key]);
			} else {
				removeLastSearch();
				lastSearch = key;
				if(name == "") {
					name = null;
				}
				addSearchMenuItem(key,name);
			}			
		}
		
		return self;
	};
	
	searchBtn.click(function() {
		self.search(query.val());	
	});
	
	eWolf.bind("select",function(event,eventId) {
		if(eventId != lastSearch && eventId != "__newmessage__"+lastSearch) {
			removeLastSearch();
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
	    
	    if(query.val() == "") {
	    	searchBtn.hide(200);
	    } else {
	    	searchBtn.show(200);
	    }
	});
		
	
	eWolf.bind("search",function(event,key,name) {
		self.search(key,name);
	});
	
	return this;
};
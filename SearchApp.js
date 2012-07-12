var SearchApp = function(id,menu,applicationFrame,query,searchBtn,addBtn) {
	var menuList = menu.createNewMenuList("search","Searches");
	var apps = new Object();
	var lastSearch = null;
	
	function addSearchMenuItem(key) {
		var app = new Profile(key,applicationFrame);
		apps[key] = app;
		
		eWolf.one("loadingEnd",function(event,eventId) {
			if(eventId == key) {
				menuList.addMenuItem(key,app.getName());
				eWolf.trigger("select",[key]);
			}
		});
		
	};
	
	function removeSearchMenuItem(key) {
		if(apps[key] != null) {
			apps[key].destroy();
			delete apps[key];
			menuList.removeMenuItem(key);
		}
	}
	
	function removeLastSearch() {
		if(lastSearch != null) {
			removeSearchMenuItem(lastSearch);
			lastSearch = null;
		}
	}
	
	function searchUser(key) {
		if(key != "") {
			if(key != eWolf.data("userID")) {
				removeLastSearch();
				lastSearch = key;
				addSearchMenuItem(key);
			}
		}	
	}
	
	addBtn.click(function() {
		var key = query.val();
		if(key != "") {
			if(key != eWolf.data("userID")) {
				addSearchMenuItem(key,"Show "+key);
			}
			eWolf.trigger("select",[key]);
		}
	});
	
	searchBtn.click(function() {
		var key = query.val();
		searchUser(key);	
	});
	
	eWolf.bind("select."+id,function(event,eventId) {
		if(eventId != lastSearch) {
			removeLastSearch();
		}
	});
	
	query.keyup(function(event){
	    if(event.keyCode == 13 && query.val() != ""){
	    	if(event.shiftKey) {
	    		addBtn.click();
	    	} else {
	    		searchBtn.click();
	    	}
	    }
	    
	    if(query.val() == "") {
	    	searchBtn.hide(200);
	    	addBtn.hide(200);
	    } else {
	    	searchBtn.show(200);
	    	addBtn.show(200);
	    }
	});
		
	
	eWolf.bind("search",function(event,key) {
		searchUser(key);
	});

	
	return {
		search: function (key) {
			searchUser(key);
		}
	};
};
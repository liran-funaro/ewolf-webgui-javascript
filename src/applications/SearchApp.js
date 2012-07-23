var SearchApp = function(id,menu,applicationFrame,query,searchBtn) {
	var menuList = menu.createNewMenuList("search","Searches");
	var apps = new Object();
	var lastSearch = null;
	
	function addSearchMenuItem(key,name) {
		menuList.addMenuItem(key,name);
		var app = new Profile(key,name,applicationFrame)
			.onReceiveName(function(newName) {
				menuList.renameMenuItem(key,newName);
				eWolf.trigger("select",[key]);
			});
		apps[key] = app;		
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
	
	function searchUser(key,name) {
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
	}
	
//	addBtn.click(function() {
//		var key = query.val();
//		if(key != "") {
//			if(key != eWolf.data("userID")) {
//				addSearchMenuItem(key,"Show "+key);
//			}
//			eWolf.trigger("select",[key]);
//		}
//	});
	
	searchBtn.click(function() {
		var key = query.val();
		searchUser(key,"Search: "+key);	
	});
	
	eWolf.bind("select."+id,function(event,eventId) {
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
//	    	addBtn.hide(200);
	    } else {
	    	searchBtn.show(200);
//	    	addBtn.show(200);
	    }
	});
		
	
	eWolf.bind("search",function(event,key,name) {
		searchUser(key,name);
	});

	
	return {
		search: function (key,name) {
			searchUser(key,name);
		}
	};
};
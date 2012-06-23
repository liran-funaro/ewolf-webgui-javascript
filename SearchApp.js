var SearchApp = function(id,menu,applicationFrame,query,searchBtn,addBtn) {
	var menuList = menu.createNewMenuList("search","Searches");
	var apps = new Object();
	var lastSearch = null;
	
	function addSearchMenuItem(key,title) {
		var app = new Flicker(key,applicationFrame);
		apps[key] = app;
		menuList.addMenuItem(key,title);
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
	
	addBtn.click(function() {
		var key = query.val();
		if(key != "") {
			addSearchMenuItem(key,"Show "+key);
			eWolf.trigger("select",[key]);
		}
	});
	
	searchBtn.click(function() {
		var key = query.val();
		if(key != "") {
			removeLastSearch();
			lastSearch = key;
			addSearchMenuItem(key,"Last: "+key);
			eWolf.trigger("select",[key]);
		}		
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
	
	return this;
};
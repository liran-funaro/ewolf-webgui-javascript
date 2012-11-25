var MenuList = function(id,title) {
	var self = this;
	
	var items = [];
	
	var frame = $("<div/>").addClass("menuList").hide();
	
	$("<div/>").addClass("menuListTitle")
		.append(title)
		.appendTo(frame);

	var list = $("<ul/>").appendTo(frame);	
	var menuItemList = $("<span/>").appendTo(list);
	var xtraItemList = $("<span/>").appendTo(list);
	
	this.addMenuItem = function(id,title) {
		if(items[id] == null) {
			var menuItem = new MenuItem(id,title)
					.appendTo(menuItemList);
			
			items[id] = menuItem;
			
			if(Object.keys(items).length > 0) {
				frame.show();
			}
		} else {
			console.log("[Menu Error] Item with id: "+ id +" already exist");
		}
		
		return self;
	};
	
	this.addExtraItem = function(item) {
		xtraItemList.append(item);
		return self;
	};
	
	this.removeMenuItem = function(removeId) {
		if(items[removeId] != null) {
			items[removeId].destroy();
			delete items[removeId];
		}
		
		if(Object.keys(items).length <= 0) {
			frame.hide();
		}
		
		return self;
	};
	
	this.renameMenuItem = function(id,newTitle) {
		if(items[id] != null) {
			items[id].renameTitle(newTitle);
		}
		
		return self;
	};
	
	this.hideMenu = function () {
		frame.hide();
		
		return self;
	};
	
	this.showMenu = function () {
		if(Object.keys(items).length > 0) {
			frame.show();
		}
		
		return self;
	};
	
	this.appendTo = function(container) {
		frame.appendTo(container);
		return self;
	};
	
	return this;
};
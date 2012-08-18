var MenuList = function(id,title,topbarFrame) {
	var self = this;
	
	var items = [];
	
	var frame = $("<div/>").addClass("menuList").hide();
	
	$("<div/>").addClass("menuListTitle")
		.append(title)
		.appendTo(frame);

	var list = $("<ul/>").appendTo(frame);	
	
	this.addMenuItem = function(id,title) {
		if(items[id] == null) {
			var menuItem = new MenuItem(id,title,
					"Click to show "+title.toLowerCase(),topbarFrame)
					.appendTo(list);
			
			items[id] = menuItem;
			
			if(Object.keys(items).length > 0) {
				frame.show();
			}
		} else {
			console.log("[Menu Error] Item with id: "+ id +" already exist");
		}
		
	};
	
	this.removeMenuItem = function(removeId) {
		if(items[removeId] != null) {
			items[removeId].destroy();
			delete items[removeId];
		}
		
		if(Object.keys(items).length <= 0) {
			frame.hide();
		}
	};
	
	this.renameMenuItem = function(id,newTitle) {
		if(items[id] != null) {
			items[id].renameTitle(newTitle);
		}
	};
	
	this.hideMenu = function () {
		frame.hide();
	};
	
	this.showMenu = function () {
		if(Object.keys(items).length > 0) {
			frame.show();
		}
	};
	
	this.appendTo = function(container) {
		frame.appendTo(container);
		return self;
	};
	
	return this;
};
var MenuList = function(menu,id,title,topbarFrame) {
	var items = [];
	
	var frame = $("<div/>").attr({
		"class" : "menuList",
		"id" : id+"Frame"
	}).hide();
	
	$("<div/>").attr({
		"class" : "menuListTitle",
		"id" : id+"Title"
	})	.append(title)
		.appendTo(frame);

	var list = $("<ul/>").attr({
		"id" : id
	})	.appendTo(frame);
	
	return {
		addMenuItem : function(id,title) {
			if(items[id] == null) {
				var menuItem = new MenuItem(id,title,
						"Click to show "+title.toLowerCase(),topbarFrame).appendTo(list);
				
				items[id] = menuItem;
				
				if(Object.keys(items).length > 0) {
					frame.show();
				}
			} else {
				console.log("[Menu Error] Item with id: "+ id +" already exist");
			}
			
		},
		removeMenuItem: function(removeId) {
			if(items[removeId] != null) {
				items[removeId].destroy();
				delete items[removeId];
			}
			
			if(Object.keys(items).length <= 0) {
				frame.hide();
			}
		},
		renameMenuItem : function(id,newTitle) {
			if(items[id] != null) {
				items[id].renameTitle(newTitle);
			}
		},
		appendTo : function(container) {
			frame.appendTo(container);
			return this;
		}
	};
};
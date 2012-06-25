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
			var menuItem = new MenuItem(id,title,
					"Click to show "+title.toLowerCase(),topbarFrame).appendTo(list);
			
			items[id] = menuItem;
			
			if(Object.keys(items).length > 0) {
				frame.show();
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
		appendTo : function(container) {
			frame.appendTo(container);
			return this;
		}
	};
};
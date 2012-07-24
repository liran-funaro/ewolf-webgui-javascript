var CommaSeperatedList = function(title) {
	var list = $("<span/>")
		.attr("class","wolfpacksBox")
		.append(title+": ")
		.hide();
	
	var items = null;
	
	this.addItem = function (item) {
		if(items == null) {
			items = $("<span/>").appendTo(list);
			list.show();
		} else {
			items.append(", ");
		}
		
		items.append(item);
	};
	
	this.removeAll = function() {
		if(items != null) {
			items.remove();
			items = null;
			list.hide();
		}		
	};
	
	this.getList = function () {
		return list;
	};
};
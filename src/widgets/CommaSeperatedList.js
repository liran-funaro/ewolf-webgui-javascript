var CommaSeperatedList = function(title) {
	var list = $("<span/>")
		.addClass("CommaSeperatedListItem")
		.append(title+": ")
		.hide();
	
	var items = null;
	var itemsArray = [];
	
	this.addItem = function (item,itemName) {
		if(items == null) {
			items = $("<span/>").appendTo(list);
			list.show();
		} else {
			items.append(", ");
		}
		
		items.append(item);
		itemsArray.push(itemName);
	};
	
	this.removeAll = function() {
		if(items != null) {
			items.remove();
			items = null;
			itemsArray = [];
			list.hide();
		}		
	};
	
	this.getList = function () {
		return list;
	};
	
	this.getItemNames = function () {
		return itemsArray;
	};
	
	this.show = function (speed) {
		if(items != null) {
			list.show(speed);
		}
	};
	
	this.hide = function (speed) {
		list.hide(speed);
	};
	
	return this;
};
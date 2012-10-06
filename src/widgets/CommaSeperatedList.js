var CommaSeperatedList = function(title) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var items = null;
	var itemsArray = [];
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	var list = $("<span/>")
		.addClass("CommaSeperatedListItem")
		.append(title+": ")
		.hide();
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
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
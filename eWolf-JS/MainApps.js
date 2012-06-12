var MainApps = function (menu,applicationFrame) {
	var menuList = menu.createNewMenuList("mainapps","Main");
	var apps = [];
	
	var wall = new Flicker("wall",applicationFrame);
	menuList.addMenuItem("wall","My Wall");
	apps.push(wall);
	
	var feed = new Flicker("news_feed",applicationFrame);
	menuList.addMenuItem("news_feed","News Feed");
	apps.push(feed);
	
	var messages = new Inbox("messages",applicationFrame);
	menuList.addMenuItem("messages","Messages");
	apps.push(messages);
	
	return this;
};




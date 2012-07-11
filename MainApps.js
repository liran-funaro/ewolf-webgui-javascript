var MainApps = function (menu,applicationFrame) {
	var menuList = menu.createNewMenuList("mainapps","Main");
	var apps = [];
	
	var profile = new Profile("profile",applicationFrame);
	menuList.addMenuItem("profile","My Profile");
	apps.push(profile);
	
	var wall = new NewsFeed("wall",applicationFrame);
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




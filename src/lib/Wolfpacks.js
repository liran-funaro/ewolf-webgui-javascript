var Wolfpacks = function (menu,request,applicationFrame) {
	var thisObj = this;
	
	var wolfpacksApps = {},
		friendsMapByName = {},
		friendsMapByID = {};
	
	this.wolfpacksArray = [];
	this.friendsNameArray = [];
	
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	
	request.register(function() {
		return {
			 wolfpacks:{}
		};
	},new ResponseHandler("wolfpacks",["wolfpacksList"],handleWolfpacks).getHandler());
	
	request.register(function() {
		return {
			wolfpackMembers:{}
		};
	},new ResponseHandler("wolfpackMembers",["membersList"],handleMembers).getHandler());
		
	this.addWolfpack = function (pack) {
		if(wolfpacksApps[pack] == null) {		
			menuList.addMenuItem("__pack__"+pack,pack);			
			var app = new WolfpackPage("__pack__"+pack,pack,applicationFrame);			
			
			wolfpacksApps[pack] = app;
			thisObj.wolfpacksArray.push(pack);
		}
		
		return thisObj;
	};
	
	this.removeWolfpack = function(pack) {
		if(wolfpacksApps[pack] != null) {
			menuList.removeMenuItem("__pack__"+pack);
			wolfpacksApps[pack].destroy();
			wolfpacksApps[pack] = null;
			
			var idx = wolfpacksArray.indexOf(pack);
			if(idx != -1){
				wolfpacksArray.splice(idx, 1);
			}
		}
		
		return thisObj;
	};
	
	this.addFriend = function(userID,userName) {
		friendsMapByName[userName] = userID;
		friendsMapByID[userID] = userName;
		thisObj.friendsNameArray.push(userName);
		
		return thisObj;
	};
	
	this.removeFriend = function(userID,userName) {
		friendsMapByName[userName] = null;
		friendsMapByID[userID] = null;
		
		var idx = thisObj.friendsNameArray.indexOf(userName);
		if(idx != -1){
			thisObj.friendsNameArray.splice(idx, 1);
		}
		
		return thisObj;
	};
	
	this.getFriendID = function (userName) {
		return friendsMapByName[userName];
	};
	
	this.getFriendName = function (userID) {
		return friendsMapByID[userID];
	};
		
	function handleWolfpacks(data, textStatus, postData) {
		$.each(data.wolfpacksList, function(i,pack){
			thisObj.addWolfpack(pack);
		});
	}
	
	function handleMembers(data, textStatus, postData) {
		$.each(data.membersList, function(i,userObj){
			thisObj.addFriend(userObj.id,userObj.name);
		});
	}
	
	return this;
};




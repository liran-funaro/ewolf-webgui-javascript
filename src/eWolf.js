EWOLF_CONSTANTS = {
	LOADING_FRAME : "loadingFrame",
	APPLICATION_FRAME : "applicationFrame",
	MAIN_FRAME : "mainFrame",
	MENU_FRAME : "menu",
	TOPBAR_FRAME : "topbarID",
	
	WELCOME_MENU_ID : "__welcome_menu__",
	MAINAPPS_MENU_ID : "__mainapps_menu__",
	WOLFPACKS_MENU_ID : "__wolfpacks_menu__",
	
	MYPROFILE_APP_ID : "profile",
	NEWSFEED_APP_ID : "newsfeed",
	INBOX_APP_ID : "inbox",
	LOGIN_APP_ID : "login"
};

var eWolf = new function() {
	var self = this;
	$.extend(this,EWOLF_CONSTANTS);
	
	this.userID = null;
	this.userName = null;
	
	this.sendToProfile = {
			userID: "THIS IS AN ERROR"
	};
	
	this.init = function() {
		$(window).bind('hashchange', self.onHashChange);
		
		self.applicationFrame = $("#"+self.APPLICATION_FRAME);
		self.mainFrame = $("#"+self.MAIN_FRAME);
		self.topBarFrame = $("#"+self.TOPBAR_FRAME);
		self.menuFrame = $("#"+self.MENU_FRAME);
		self.loadingFrame = $("#"+self.LOADING_FRAME);
		
		new Loading(self.loadingFrame);		
		
		self.sideMenu = new SideMenu(self.menuFrame,
				self.mainFrame,self.topBarFrame);
		
		self.welcome = self.sideMenu.createNewMenuList(
				self.WELCOME_MENU_ID,"Welcome");
		
		self.mainApps = self.sideMenu.createNewMenuList(
				self.MAINAPPS_MENU_ID,"Main");
		
		self.wolfpacksMenuList = self.sideMenu.createNewMenuList(
				self.WOLFPACKS_MENU_ID,"Wolfpacks");		
		
		self.getUserInformation();
	};
	
	this.getUserInformation = function () {
		var responseHandler = new ResponseHandler("profile",
				["id","name"]);
		
		var request = new PostRequestHandler("eWolf","/json",0)
			.register(function() {
				return {
					profile: self.sendToProfile
				};
			},responseHandler.getHandler());
		
		function onLoggedIn(data, textStatus, postData) {
			document.title = "eWolf - " + data.name;
			
			self.userID = data.id;
			self.userName = data.name;
			
			if(self.loginApp) {
				self.loginApp.destroy();
			}
				
			self.createMainApps();
		}
		
		function onNotLoggedIn(data, textStatus, postData) {
			// Welcome
			self.welcome.addMenuItem(self.LOGIN_APP_ID,"Login");
			if(!self.loginApp) {
				self.loginApp = new Login(self.LOGIN_APP_ID,self.applicationFrame).select();
			}		
		}
		
		responseHandler.success(onLoggedIn);	
		responseHandler.error(onNotLoggedIn).badResponseHandler(onNotLoggedIn);
		
		request.requestAll();
	};
	
	this.createMainApps = function () {
		self.welcome.hideMenu();
		self.logout = new Logout("Logout",eWolf.topBarFrame);
		
		self.wolfpacks = new Wolfpacks(self.wolfpacksMenuList,self.applicationFrame);
		self.wolfpacks.addFriend(self.userID, self.userName);
		
		self.mainApps.addMenuItem(self.MYPROFILE_APP_ID,"My Profile");
		self.profileApp = new Profile(self.MYPROFILE_APP_ID,self.userID,
				self.userName,self.applicationFrame);
		
		self.mainApps.addMenuItem(self.NEWSFEED_APP_ID,"News Feed");
		self.newsFeedApp = new WolfpackPage(self.NEWSFEED_APP_ID,null,self.applicationFrame);
		
		self.mainApps.addMenuItem(self.INBOX_APP_ID,"Messages");
		self.inboxApp = new Inbox(self.INBOX_APP_ID,self.applicationFrame);
		
		self.searchApp = new SearchApp(self.sideMenu,
				self.applicationFrame,$("#"+self.TOPBAR_FRAME));
		
		self.wolfpacks.requestWolfpacks(function() {
			self.onHashChange();
		});		
	};
	
	this.onHashChange = function() {
		var selected = null;
		if(window.location.hash && window.location.hash != "") {
			selected = window.location.hash.replace("#", "");
			
			var found = false;
			
			$.each($(self).data("events").select, function(i,handler) {
				if(handler.namespace == selected) {
					found = true;
					return false;
				}
			});
			
			if(found) {
				self.trigger("select",[selected]);
			} else {
				var selectedSubString = selected.substring(0,
						self.searchApp.SEARCH_PROFILE_PREFIX.length);
				
				if(selectedSubString ==
					self.searchApp.SEARCH_PROFILE_PREFIX) {
					var searchTerm = selected.substring(selectedSubString.length);
					if(searchTerm != "") {
						self.trigger("search",[searchTerm]);
					} else {
						self.selectApp(self.NEWSFEED_APP_ID);
					}					
				} else {
					self.selectApp(self.NEWSFEED_APP_ID);
				}				
			}			
		} else {
			self.selectApp(self.NEWSFEED_APP_ID);
		}
	};
	
	this.selectApp = function (id) {
		var newHash = "#"+id;
		if(window.location.hash != newHash) {
			window.location.hash = newHash;
		} else {
			self.onHashChange();
		}				
	};
	
	this.bind = function (arg0,arg1) {
		$(self).bind(arg0,arg1);
		return self;
	};
	
	this.unbind = function (arg0,arg1) {
		$(self).unbind(arg0,arg1);
		return self;
	};
	
	this.trigger = function (arg0,arg1) {
		$(self).trigger(arg0,arg1);
		return self;
	};
	
	return this;
};

$(document).ready(function () {
	eWolf.init();	
});

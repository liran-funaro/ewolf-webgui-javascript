EWOLF_CONSTANTS = {
	REFRESH_INTERVAL_SEC : 60,
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
	LOGIN_APP_ID : "login",
	SIGNUP_APP_ID : "signup",
	LOGOUT_APP_ID : "logout",
	
	FIRST_EWOLF_LOGIN_REQUEST_ID : "eWolfLogin",
	
	PROFILE_REQUEST_NAME : "__main_profile_request__",
	WOLFPACKS_REQUEST_NAME : "__main_wolfpacks_request",
	MEMBERS_REQUEST_NAME : "__main_members_request__"
};

var eWolf = new function() {
	var self = this;
	$.extend(this,EWOLF_CONSTANTS);
	
	this.userID = null;
	this.userName = null;
	this.selectedApp = null;
	
	this.serverRequest = null;
	
	this.mainAppsCreated = false;
	
	this.init = function() {
		self.serverRequest = new PostRequestHandler("/json",self.REFRESH_INTERVAL_SEC);
		
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
		
		self.serverRequest.registerRequest(self.PROFILE_REQUEST_NAME,
				function() {
					return { profile : {}	};
				});
		
		self.serverRequest.registerRequest(self.WOLFPACKS_REQUEST_NAME,
				function() {
					return { wolfpacks : {}	};
				});
		
		self.serverRequest.bindRequest(self.PROFILE_REQUEST_NAME, self.FIRST_EWOLF_LOGIN_REQUEST_ID);
		self.serverRequest.bindRequest(self.WOLFPACKS_REQUEST_NAME);
		
		self.members = new Members();		
		self.wolfpacks = new Wolfpacks(self.wolfpacksMenuList,self.applicationFrame);
		self.profile = new Profile(self.MYPROFILE_APP_ID,self.applicationFrame);
		
		self.serverRequest.registerHandler(self.PROFILE_REQUEST_NAME,
				new ResponseHandler("profile",["id","name"],
						function (data, textStatus, postData) {
					document.title = "eWolf - " + data.name;
					self.userID = data.id;
					self.userName = data.name;
				}).getHandler());
		
		self.serverRequest.complete(null,function(appID, response, status) {
			if(self.mainAppsCreated) {
				if(response.status != 200 || self.userID == null) {
					document.location.reload(true);
				}				
			} else if(response.status == 200 && self.userID != null) {
				self.serverRequest.restartRefreshInterval();
				self.createMainApps();
			} else if(response.status != 200 || self.userID == null) {
				self.serverRequest.stopRefreshInterval();
				self.presentLoginScreen();
			}
		});
		
		self.getUserInformation();
	};
	
	this.getUserInformation = function () {
		if(self.loginApp) {
			self.loginApp.destroy();
			self.loginApp = null;
		}
		
		if(self.signupApp) {
			self.signupApp.destroy();
			self.signupApp = null;
		}
		
		self.serverRequest.requestAll(self.FIRST_EWOLF_LOGIN_REQUEST_ID, true);
	};
	
	this.createMainApps = function () {
		self.mainAppsCreated = true;
		
		self.welcome.hideMenu();
		self.logout = new Logout(self.LOGOUT_APP_ID,"Logout",eWolf.topBarFrame);
		
		self.mainApps.addMenuItem(self.MYPROFILE_APP_ID,"My Profile");
				
		self.mainApps.addMenuItem(self.NEWSFEED_APP_ID,"News Feed");
		self.newsFeedApp = new WolfpackPage(self.NEWSFEED_APP_ID,null,self.applicationFrame);
		
		self.mainApps.addMenuItem(self.INBOX_APP_ID,"Messages");
		self.inboxApp = new Inbox(self.INBOX_APP_ID,self.applicationFrame);
		
		self.searchBar = new SearchBar(self.sideMenu,
				self.applicationFrame,$("#"+self.TOPBAR_FRAME));
		
		self.serverRequest.setRequestAllOnSelect(true);
		self.onHashChange();
	};
	
	this.presentLoginScreen = function() {
		self.serverRequest.stopRefreshInterval();
		self.serverRequest.setRequestAllOnSelect(false);
		
		// Welcome
		self.welcome.addMenuItem(self.LOGIN_APP_ID,"Login");
		if(!self.loginApp) {
			self.loginApp = new Login(self.LOGIN_APP_ID,self.applicationFrame).select();
		}
		
		self.welcome.addMenuItem(self.SIGNUP_APP_ID,"Signup");
		if(!self.signupApp) {
			self.signupApp = new Signup(self.SIGNUP_APP_ID,self.applicationFrame);
		}
	};
	
	this.onHashChange = function() {
		if(window.location.hash && window.location.hash != "") {
			var selected = window.location.hash.replace("#", "");
			
			var found = false;
			
			$.each($(self).data("events").select, function(i,handler) {				
				if(handler.type == "select" && handler.namespace == selected) {
					found = true;
					return false;
				}
			});
			
			if(found) {
				self.trigger("select",[selected]);
			} else {
				var selectedSubString = selected.substring(0,
						self.searchBar.SEARCH_PROFILE_PREFIX.length);
				
				if(selectedSubString ==
					self.searchBar.SEARCH_PROFILE_PREFIX) {
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
	
	this.bind("select",function(event,eventId) {
		self.selectedApp = eventId;
	});
	
	return this;
};

$(document).ready(function () {
	eWolf.init();	
});

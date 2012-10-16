var eWolf = new function() {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	$.extend(this,EWOLF_CONSTANTS);
	
	this.userID = null;
	this.userName = null;
	this.selectedApp = null;
	
	this.serverRequest = null;
	
	this.mainAppsCreated = false;
	
	this.notificationCount = 0;
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.init = function() {
		self.serverRequest = new PostRequestHandler(
				self.JSON_REQUEST,
				self.REQUEST_INTERVAL_ACTIVE_MILLISECOUNDS);
		
		$(window).bind('hashchange', self.onHashChange);
		
		self.applicationFrame = $("#"+self.APPLICATION_FRAME);
		self.mainFrame = $("#"+self.MAIN_FRAME);
		self.topBarFrame = $("#"+self.TOPBAR_FRAME);
		self.menuFrame = $("#"+self.MENU_FRAME);
		self.loadingFrame = $("#"+self.LOADING_FRAME);
		
		new Loading(self.loadingFrame);		
		
		self.sideMenu = new SideMenu(self.menuFrame,
				self.mainFrame);
		
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
					return { wolfpacksAll : {}	};
				});
		
		self.serverRequest.registerRequest(eWolf.APPROVED_MEMBERS_REQUEST_NAME,
				function() {
					var result = {};
					result[eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS1] = {
							wolfpackName : eWolf.APPROVED_WOLFPACK_NAME
					};
					
					result[eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS2] = {
							wolfpackName : eWolf.APPROVED_ME_WOLFPACK_NAME
					};
					
					return result;
				});
		
		self.serverRequest.bindRequest(self.PROFILE_REQUEST_NAME, self.FIRST_EWOLF_LOGIN_REQUEST_ID);
		self.serverRequest.bindRequest(self.WOLFPACKS_REQUEST_NAME);
		
		self.members = new Members();		
		self.wolfpacks = new Wolfpacks(self.wolfpacksMenuList,self.applicationFrame);
		self.profile = new Profile(self.MYPROFILE_APP_ID,self.applicationFrame);
		
		self.serverRequest.registerHandler(self.PROFILE_REQUEST_NAME,
				new ResponseHandler("profile",["id","name"],
						function (data, textStatus, postData) {
					self.userID = data.id;
					self.userName = data.name;
					self.updateTitle();
				}).getHandler());
		
		self.serverRequest.addOnComplete(null,function(appID, response, status) {
			if(self.mainAppsCreated) {
				if(response.status != 200 || self.userID == null) {
					alert("realod now");
					console.log(response);
					//document.location.reload(true);
				}				
			} else if(response.status == 200 && self.userID != null) {
				self.serverRequest.restartRefreshInterval();
				self.createMainApps();
			} else if(response.status != 200 || self.userID == null) {
				self.serverRequest.stopRefreshInterval();
				self.presentLoginScreen();
			}
		});
		
		$("#eWolfTitleLink").click(function() {
			self.trigger("refresh",[self.selectedApp]);
		});
		
		self.getUserInformation();
	};
	
	this.updateTitle = function () {
		var title = "eWolf";
		if(self.userName) {
			title += " - " + self.userName;
		}
		
		if(self.notificationCount > 0) {
			title += " (" + self.notificationCount + ")";
		}
		
		document.title = title;
		
		return self;
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
		
		return self;
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
		
		self.pendingRequests = new PendingRequests(self.topBarFrame);
		
		self.searchBar = new SearchBar(self.sideMenu,
				self.applicationFrame,self.topBarFrame);
		
		self.serverRequest.setRequestAllOnSelect(true);
		self.onHashChange();
		
		self.monitor = new IdleMonitor(
				self.TIMEOUT_AWAY_MINUTES,
				self.TIMEOUT_AWAY_FOR_LONG_MINUTES,
				self.TIMEOUT_IDLE_MINUTES);
		
		self.bind(self.EVENT_AWAY, function() {
			//console.log(self.EVENT_AWAY);
			self.serverRequest.setRefreshInterval(
					eWolf.REQUEST_INTERVAL_AWAY_MILLISECOUNDS);
		});
		
		self.bind(self.EVENT_AWAY_FOR_LONG, function() {
			//console.log(self.EVENT_AWAY_FOR_LONG);
			self.serverRequest.setRefreshInterval(
					eWolf.REQUEST_INTERVAL_AWAY_FOR_LONG_MILLISECOUNDS);
		});
		
		self.bind(self.EVENT_IDLE, function() {
			//console.log(self.EVENT_IDLE);
			self.serverRequest.setRefreshInterval(
					eWolf.REQUEST_INTERVAL_IDLE_MILLISECOUNDS);
		});
		
		self.bind(self.EVENT_ACTIVE, function() {
			//console.log(self.EVENT_ACTIVE);
			self.serverRequest.setRefreshInterval(
					eWolf.REQUEST_INTERVAL_ACTIVE_MILLISECOUNDS);
			self.serverRequest.requestAll(self.selectedApp,false);
		});
		
		self.monitor.initialize();
		
		return self;
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
		
		return self;
	};
	
	this.onHashChange = function() {
		if(window.location.hash && window.location.hash != "") {
			var selected = window.location.hash.replace("#", "");
			
			var found = false;
			
			$.each($._data(self, "events").select, function(i,handler) {				
				if(handler.type == "select" && handler.namespace == selected) {
					found = true;
					return false;
				}
			});
			
			if(found) {
				self.trigger("select",[selected]);
			} else if(self.searchBar){
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
		
		return self;
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

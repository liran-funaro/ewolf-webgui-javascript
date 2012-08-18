IDENTIFIERS = {
	LOADING_FRAME : "loadingFrame",
	APPLICATION_FRAME : "applicationFrame",
	MAIN_FRAME : "mainFrame",
	MENU_FRAME : "menu",
	TOPBAR_FRAME : "topbarID",
	
	WELCOME_MENU_ID : "__welcome_menu__",
	MAINAPPS_MENU_ID : "__mainapps_menu__",
	WOLFPACKS_MENU_ID : "__wolfpacks_menu__",
	
	NEWSFEED_APP_ID : "__newsFeed_mainApp__",
	INBOX_APP_ID : "__inbox_mainApp__",
	LOGIN_APP_ID : "__login_welcome_screen__"
};

var eWolfMaster = new function() {
	var self = this;
	
	this.userID = null;
	this.userName = null;
	
	this.init = function() {
		new Loading($("#"+IDENTIFIERS.LOADING_FRAME));
		self.applicationFrame = $("#"+IDENTIFIERS.APPLICATION_FRAME);
		
		self.sideMenu = new SideMenu($("#"+IDENTIFIERS.MENU_FRAME),
				$("#"+IDENTIFIERS.MAIN_FRAME),
				$("#"+IDENTIFIERS.TOPBAR_FRAME));
		
		self.welcome = self.sideMenu.createNewMenuList(
				IDENTIFIERS.WELCOME_MENU_ID,"Welcome");
		
		self.mainApps = self.sideMenu.createNewMenuList(
				IDENTIFIERS.MAINAPPS_MENU_ID,"Main");
		
		self.wolfpacksMenuList = self.sideMenu.createNewMenuList(
				IDENTIFIERS.WOLFPACKS_MENU_ID,"Wolfpacks");
		
		// Welcome
		self.welcome.addMenuItem(IDENTIFIERS.LOGIN_APP_ID,"Login");
		new Login(IDENTIFIERS.LOGIN_APP_ID,self.applicationFrame);
		
		self.getUserInformation();
		//eWolf.trigger("select",[IDENTIFIERS.LOGIN_APP_ID]);
	};
	
	this.getUserInformation = function () {
		var responseHandler = new ResponseHandler("profile",
				["id","name"]);
		
		var request = new PostRequestHandler("eWolf","/json",0)
			.register(function() {
				return {
					profile: {}
				};
			},responseHandler.getHandler());
		
		function onLoggedIn(data, textStatus, postData) {
			document.title = "eWolf - " + data.name;
			
			self.userID = data.id;
			self.userName = data.name;
			eWolf.data('userID',data.id);
			eWolf.data('userName',data.name);
				
			self.createMainApps();
		}
		
		function onNotLoggedIn(data, textStatus, postData) {
			eWolf.trigger("select",[IDENTIFIERS.LOGIN_APP_ID]);
		}
		
		responseHandler.success(onLoggedIn);	
		responseHandler.error(onNotLoggedIn).badResponseHandler(onNotLoggedIn);
		
		request.requestAll();
	};
	
	this.createMainApps = function () {
		self.welcome.hideMenu();
		
		self.wolfpacks = new Wolfpacks(self.wolfpacksMenuList,self.applicationFrame);
		self.wolfpacks.addFriend(self.userID, self.userName);
		self.wolfpacks.requestWolfpacks();
		
		self.mainApps.addMenuItem(self.userID,"My Profile");
		new Profile(self.userID,self.userName,
				self.applicationFrame);
		
		self.mainApps.addMenuItem(IDENTIFIERS.NEWSFEED_APP_ID,"News Feed");
		new WolfpackPage(IDENTIFIERS.NEWSFEED_APP_ID,null,self.applicationFrame);
		
		self.mainApps.addMenuItem(IDENTIFIERS.INBOX_APP_ID,"Messages");
		new Inbox(IDENTIFIERS.INBOX_APP_ID,self.applicationFrame);
		
		new SearchApp(self.sideMenu,
				self.applicationFrame,$("#"+IDENTIFIERS.TOPBAR_FRAME));
		
		eWolf.trigger("select",[IDENTIFIERS.NEWSFEED_APP_ID]);
	};
};

var eWolf = $(eWolfMaster);

$(document).ready(function () {
	eWolfMaster.init();
});

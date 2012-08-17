var eWolfMaster = new function() {
};

var eWolf = $(eWolfMaster);

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

$(document).ready(function () {
	new Loading($("#"+IDENTIFIERS.LOADING_FRAME));
	eWolf.applicationFrame = $("#"+IDENTIFIERS.APPLICATION_FRAME);
	
	eWolf.sideMenu = new SideMenu($("#"+IDENTIFIERS.MENU_FRAME),
			$("#"+IDENTIFIERS.MAIN_FRAME),
			$("#"+IDENTIFIERS.TOPBAR_FRAME));
	
	eWolf.welcome = eWolf.sideMenu.createNewMenuList(
			IDENTIFIERS.WELCOME_MENU_ID,"Welcome");
	
	eWolf.mainApps = eWolf.sideMenu.createNewMenuList(
			IDENTIFIERS.MAINAPPS_MENU_ID,"Main");
	
	eWolf.wolfpacksMenuList = eWolf.sideMenu.createNewMenuList(
			IDENTIFIERS.WOLFPACKS_MENU_ID,"Wolfpacks");
	
	getUserInformation();
});

function getUserInformation() {
	var request = new PostRequestHandler("eWolf","/json",0)
		.register(function() {
			return {
				profile: {}
			};
		},new ResponseHandler("profile",
					["id","name"],handleProfileData).getHandler());
	
	eWolf.wolfpacks = new Wolfpacks(eWolf.wolfpacksMenuList,request,eWolf.applicationFrame);
	request.requestAll();
	
	function handleProfileData(data, textStatus, postData) {
		document.title = "eWolf - " + data.name;
			
		eWolf.data('userID',data.id);
		eWolf.data('userName',data.name);
			
		createMainApps();
	}	
}

function createMainApps() {
	eWolf.wolfpacks.addFriend(eWolf.data("userID"), eWolf.data("userName"));
	
	eWolf.mainApps.addMenuItem(eWolf.data("userID"),"My Profile");
	new Profile(eWolf.data("userID"),eWolf.data('userName'),
			eWolf.applicationFrame);
	
	eWolf.mainApps.addMenuItem(IDENTIFIERS.NEWSFEED_APP_ID,"News Feed");
	new WolfpackPage(IDENTIFIERS.NEWSFEED_APP_ID,null,eWolf.applicationFrame);
	
	eWolf.mainApps.addMenuItem(IDENTIFIERS.INBOX_APP_ID,"Messages");
	new Inbox(IDENTIFIERS.INBOX_APP_ID,eWolf.applicationFrame);
	
	new SearchApp(eWolf.sideMenu,
			eWolf.applicationFrame,$("#"+IDENTIFIERS.TOPBAR_FRAME));
	
	// Welcome
	eWolf.welcome.addMenuItem(IDENTIFIERS.LOGIN_APP_ID,"Login");
	new Login(IDENTIFIERS.LOGIN_APP_ID,eWolf.applicationFrame);
	
	eWolf.trigger("select",[IDENTIFIERS.NEWSFEED_APP_ID]);
}
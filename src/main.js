var eWolfMaster = new function() {
};

var eWolf = $(eWolfMaster);

$(document).ready(function () {
	new Loading($("#loadingFrame"));
	eWolf.applicationFrame = $("#applicationFrame");
	
	eWolf.sideMenu = new SideMenu($("#menu"),$("#mainFrame"),$("#topbarID"));	
	eWolf.mainApps = eWolf.sideMenu.createNewMenuList("mainapps","Main");
	eWolf.wolfpacksMenuList = eWolf.sideMenu.createNewMenuList("wolfpacks","Wolfpacks");
	
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
	new Profile(eWolf.data("userID"),eWolf.data('userName'),eWolf.applicationFrame);
	
	eWolf.mainApps.addMenuItem("newsFeedApp","News Feed");
	new WolfpackPage("newsFeedApp",null,eWolf.applicationFrame);
	
	eWolf.mainApps.addMenuItem("messages","Messages");
	new Inbox("messages",eWolf.applicationFrame);
	
	new SearchApp("search",eWolf.sideMenu,eWolf.applicationFrame,
			$("#txtSearchBox"),$("#btnSearch"),$("#btnAdd"));
	
	eWolf.trigger("select",["newsFeedApp"]);
}
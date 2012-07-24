var eWolfMaster = new function() {
};

var eWolf = $(eWolfMaster);

$(document).ready(function () {
	new Loading($("#loadingFrame"));
	
	eWolf.sideMenu = new SideMenu($("#menu"),$("#mainFrame"),$("#topbarID"));	
	eWolf.applicationFrame = $("#applicationFrame");	
	eWolf.mainApps = eWolf.sideMenu.createNewMenuList("mainapps","Main");
	
	getUserInformation();
});

function getUserInformation() {
	var request = new PostRequestHandler("eWolf","/json",0)
		.register(function() {
			return {
				profile: {}
			};
		},new ResonseHandler("profile",
					["id","name"],handleProfileData));
	
	eWolf.wolfpacks = new Wolfpacks(eWolf.sideMenu,request,eWolf.applicationFrame);
	request.requestAll();
	
	function handleProfileData(data, textStatus, postData) {
		document.title = "eWolf - " + data.name;
			
		eWolf.data('userID',data.id);
		eWolf.data('userName',data.name);
			
		createMainApps();			
	}	
}

function createMainApps() {
		
	eWolf.mainApps.addMenuItem(eWolf.data("userID"),"My Profile");
	new Profile(eWolf.data("userID"),eWolf.data('userName'),eWolf.applicationFrame);
	
	eWolf.mainApps.addMenuItem("__pack__wall-readers","News Feed");
	
	eWolf.mainApps.addMenuItem("messages","Messages");
	new Inbox("messages",eWolf.applicationFrame);
	
	new SearchApp("search",eWolf.sideMenu,eWolf.applicationFrame,
			$("#txtSearchBox"),$("#btnSearch"),$("#btnAdd"));
}
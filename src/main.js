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
	
	new Wolfpacks(eWolf.sideMenu,request,eWolf.applicationFrame);
	request.requestAll();
	
	function handleProfileData(data, textStatus, postData) {
		document.title = "eWolf - " + data.name;
			
		eWolf.data('userID',data.id);
		eWolf.data('userName',data.name);
			
		InitEWolf();			
	}	
}

function InitEWolf() {
		
	eWolf.mainApps.addMenuItem(eWolf.data("userID"),"My Profile");
	new Profile(eWolf.data("userID"),eWolf.data('userName'),eWolf.applicationFrame);
	
//	menuList.addMenuItem("news_feed","News Feed");
//	new NewsFeed("news_feed",applicationFrame);
	
	eWolf.mainApps.addMenuItem("messages","Messages");
	new Inbox("messages",eWolf.applicationFrame);
	
	new SearchApp("search",eWolf.sideMenu,eWolf.applicationFrame,
			$("#txtSearchBox"),$("#btnSearch"),$("#btnAdd"));
	
	
	testZone();	
	//eWolf.trigger("select",["news_feed"]);
}

function testZone() {
	$("#btnLoad").click(function() {
		alert("Does nothing...");
	});
}
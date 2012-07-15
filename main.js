var eWolfMaster = new function() {
};

var eWolf = $(eWolfMaster);

$(document).ready(function () {
	getUserInformation();
});

function getUserInformation() {
	var request = new PostRequestHandler("eWolf","/json",handleNewData,null,0);

	function handleNewData(data, postData) {
		console.log(data);
		if (data.profile != null) {
			if (data.profile.result == "success") {
				document.title = "eWolf - " + data.profile.name;
				
				eWolf.data('userID',data.profile.id);
				eWolf.data('userName',data.profile.name);
				
				InitEWolf();
			} else {
				console.log(data.profile.result);
			}

		} else {
			console.log("No profile parameter in response");
		}
	}
	
	request.getData({
		profile: {}
	  });
}

function InitEWolf() {
	new Loading($("#loadingFrame"));
	var sideMenu = new SideMenu($("#menu"),$("#mainFrame"),$("#topbarID"));
	
	var applicationFrame = $("#applicationFrame");
	
	var menuList = sideMenu.createNewMenuList("mainapps","Main");
	
	menuList.addMenuItem(eWolf.data("userID"),"My Profile");
	new Profile(eWolf.data("userID"),applicationFrame);
	
//	menuList.addMenuItem("news_feed","News Feed");
//	new NewsFeed("news_feed",applicationFrame);
	
	menuList.addMenuItem("messages","Messages");
	new Inbox("messages",applicationFrame);
	
	new Wolfpacks(sideMenu,applicationFrame);
	
	new SearchApp("search",sideMenu,applicationFrame,
			$("#txtSearchBox"),$("#btnSearch"),$("#btnAdd"));
	
	
	testZone();
	
	
	//eWolf.trigger("select",["news_feed"]);
}

function testZone() {
	$("#btnLoad").click(function() {
		alert("Does nothing...");
	});
}
/*!
 * Main function
 * Initializations
 */

$(document).ready(function () {
	new Loading($("#loadingFrame"));
	var sideMenu = new SideMenu($("#menu"),$("#mainFrame"),$("#topbarID"));
	new MainApps(sideMenu,$("#applicationFrame"));
	new Wolfpacks(sideMenu,$("#applicationFrame"));
	new SearchApp("search",sideMenu,$("#applicationFrame"),
			$("#txtSearchBox"),$("#btnSearch"),$("#btnAdd"));
	
	testZone();
	
	//eWolf.trigger("select",["news_feed"]);
});

function testZone() {
	$("#btnLoad").click(function() {
		alert("Does nothing...");
	});
}
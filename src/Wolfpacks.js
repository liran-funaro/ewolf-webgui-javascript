var Wolfpacks = function (menu,request,applicationFrame) {		
	var wolfpackList = [];
	
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	
	request.register(function() {
		return {
			 wolfpacks:{}
		};
	},new ResonseHandler("wolfpacks",
			["wolfpacksList"],handleWolfpacks));
		
	function addWolfpackApp(pack) {
		var app = new WolfpackPage("__pack__"+pack,pack,applicationFrame);
		menuList.addMenuItem("__pack__"+pack,pack);
		wolfpackList.push(app);
	};
	
	function handleWolfpacks(data, textStatus, postData) {
		$.each(data.wolfpacksList,
				function(i,pack){
			addWolfpackApp(pack);
		});			
	}
	
	return this;
};




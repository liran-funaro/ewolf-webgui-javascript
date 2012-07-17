var Wolfpacks = function (menu,request,applicationFrame) {		
	var wolfpackList = [];
	
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	
	request.register(function() {
		return {
			 wolfpacks:{}
		};
	},handleWolfpacks);
		
	function addWolfpackApp(pack) {
		var app = new WolfpackPage("__pack__"+pack,pack,applicationFrame);
		menuList.addMenuItem("__pack__"+pack,pack);
		wolfpackList.push(app);
	};
	
	function handleWolfpacks(data, textStatus, postData) {		
		if(data.wolfpacks != null) {
			if(data.wolfpacks.result == "success") {
				if(data.wolfpacks.wolfpacksList != null) {
					$.each(data.wolfpacks.wolfpacksList,
							function(i,pack){
						addWolfpackApp(pack);
					});
				} else {
					console.log("No wolfpackList parameter in response");
				}
				
			} else {
				console.log(data.wolfpacks.result);
			}
			
		} else {
			console.log("No wolfpacks parameter in response");
		}
	}
	
	return this;
};




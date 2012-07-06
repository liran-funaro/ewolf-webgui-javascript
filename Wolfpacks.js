var Wolfpacks = function (menu,applicationFrame) {		
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	var request = new RequestHandler("wolfpacks","/json",handleWolfpacks,null,0);
	var wolfpackList = [];

	request.getData( {
		 wolfpacks:{}
	} , null);
		
	function addWolfpackApp(key,title) {
		var app = new Flicker(key,applicationFrame);
		menuList.addMenuItem(key,title);
		wolfpackList.push(app);
	};
	
	function handleWolfpacks(data, params) {
		console.log(data);
		
		if(data.wolfpacks != null) {
			if(data.wolfpacks.result == "success") {
				if(data.wolfpacks.wolfpacksList != null) {
					$.each(data.wolfpacks.wolfpacksList,
							function(i,pack){
						addWolfpackApp("__packid__"+pack, pack);
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




var Wolfpacks = function (menu,applicationFrame) {		
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	var eWolfJsonGetter = new JSonGetter("wolfpacks","/json",handleWolfpacks,null,0);
	var wolfpackList = [];

	eWolfJsonGetter.getData( {
		 wolfpacks:{}
	} , null);
	
	console.log({wolfpacks6:{}});
	
	function addWolfpackApp(key,title) {
		var app = new Flicker(key,applicationFrame);
		menuList.addMenuItem(key,title);
		wolfpackList.push(app);
	};
	
	function handleWolfpacks(data, params) {
		console.log(data);
		if(data.wolfpacks != null) {
			$.each(data.wolfpacks, function(i,pack){
				addWolfpackApp("__packid__"+pack, pack);
			});
		}
	}
	
	return this;
};




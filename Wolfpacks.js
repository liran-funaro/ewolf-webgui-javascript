var Wolfpacks = function (menu,applicationFrame) {
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	var wolfpacks = [];
	loadWolfpacks();
	
	function addWolfpackApp(key,title) {
		var app = new Flicker(key,applicationFrame);
		menuList.addMenuItem(key,title);
		wolfpacks.push(app);
	};
	
	/*!
	 * Load menu from eWolf server.
	 * Will be used to load wolfpacks of the user.
	 */
	function loadWolfpacks() {		
		$.getJSON("/json?callBack=?",
		{
			 wolfpacks: "my"
		}, function(data) {
			console.log(data);
			$.each(data, function(i,item){
				if(item.key == "wolfpacks") {
					$.each(item.data, function(i,pack){
						addWolfpackApp("__packid__"+pack, pack);
					});
				} else if(item.key == "wolfpacks2") {
					console.log(item.data);
				}
			});  
	  });	
	}
	
	return this;
};




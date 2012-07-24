var Wolfpacks = function (menu,request,applicationFrame) {
	var obj = this;
	
	var wolfpacks = {};
	
	var menuList = menu.createNewMenuList("wolfpacks","Wolfpacks");
	
	request.register(function() {
		return {
			 wolfpacks:{}
		};
	},new ResonseHandler("wolfpacks",["wolfpacksList"],handleWolfpacks));
		
	this.addWolfpack = function (pack) {
		if(wolfpacks[pack] == null) {		
			if(pack != "wall-readers") {
				menuList.addMenuItem("__pack__"+pack,pack);
			}
			
			var app = new WolfpackPage("__pack__"+pack,pack,applicationFrame);
			
			
			wolfpacks[pack] = app;
		}		
	};
	
	this.removeWolfpack = function(pack) {
		if(wolfpacks[pack] != null) {
			menuList.removeMenuItem("__pack__"+pack);
			wolfpacks[pack].destroy();
			wolfpacks[pack] = null;
		}
	};
	
	function handleWolfpacks(data, textStatus, postData) {
		$.each(data.wolfpacksList,
				function(i,pack){
			obj.addWolfpack(pack);
		});
		
		eWolf.trigger("select",["__pack__wall-readers"]);
	}	
	
	return this;
};




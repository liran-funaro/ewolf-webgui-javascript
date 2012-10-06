var Wolfpacks = function (menuList,applicationFrame) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	$.extend(this,WOLFPACK_CONSTANTS);
	
	var wolfpacksApps = {},
			UID = 100;
	
	this.wolfpacksArray = [];
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	menuList.addExtraItem(CreateNewWolfpackLink());	
	
	var wolfpacksResponseHandler = new ResponseHandler("wolfpacksAll",
			["wolfpacksList"],handleWolfpacks);
	
	eWolf.serverRequest.registerHandler(eWolf.WOLFPACKS_REQUEST_NAME,
			wolfpacksResponseHandler.getHandler());
	
	function handleWolfpacks(data, textStatus, postData) {
		$.each(data.wolfpacksList, function(i,pack){
			self.addWolfpack(pack);
		});
	}
	
	this.addWolfpack = function (pack) {
		if(wolfpacksApps[pack] == null) {
			var packID = self.WOLFPACK_APP_PREFIX + pack + "_" + UID;
			UID += 1;
			packID = packID.replace(/[^a-zA-Z0-9_:]/g,'_');
			menuList.addMenuItem(packID,pack);			
			var app = new WolfpackPage(packID,pack,applicationFrame);			
			
			wolfpacksApps[pack] = app;
			self.wolfpacksArray.push(pack);
		}
		
		return self;
	};
	
	this.getWolfpackAppID = function(pack) {
		var app = wolfpacksApps[pack];
		if(app) {
			return app.getId();
		} else {
			return null;
		}
	};
	
	this.removeWolfpack = function(pack) {
		if(wolfpacksApps[pack] != null) {
			menuList.removeMenuItem("__pack__"+pack);
			wolfpacksApps[pack].destroy();
			wolfpacksApps[pack] = null;
			
			var idx = wolfpacksArray.indexOf(pack);
			if(idx != -1){
				wolfpacksArray.splice(idx, 1);
			}
		}
		
		return self;
	};
	
	this.createWolfpacks = function(wolfpacks,onComplete) {
		if(wolfpacks.length > 0) {			
			var responseHandler = new ResponseHandler("createWolfpack",[],null);
			
			responseHandler.success(function(data, textStatus, postData) {
				$.each(wolfpacks,function(i,pack) {
					self.addWolfpack(pack);
				});
			}).error(function(data, textStatus, postData) {				
				if(data.wolfpacksResult == null) {
					console.log("No wolfpacksResult in response");
				} else {
					$.each(data.wolfpacksResult, function(i,response) {
						if(response.result == RESPONSE_RESULT.SUCCESS) {
							self.addWolfpack(postData.wolfpackNames[i]);
						}
					});
				}
			}).complete(onComplete);
			
			eWolf.serverRequest.request("wolfpacks",{
				createWolfpack: {
					wolfpackNames: wolfpacks
				}
			},responseHandler.getHandler());
			
		} else {
			if(onComplete) {
				onComplete();
			}			
		}
	};
	
	return this;
};




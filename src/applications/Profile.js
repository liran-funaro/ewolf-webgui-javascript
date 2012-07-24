var Profile = function (id,name,applicationFrame) {
	var obj = this;
	
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var waitingForName = [];
	
	var userObj = {};
	
	if(id != eWolf.data("userID")) {
		userObj.userID = id;
	}
	
	var newsFeedObj = {
			newsOf:"user"
		};
	$.extend(newsFeedObj,userObj);
	
	var handleProfileResonse = new ResonseHandler("profile",
			["id","name"],handleProfileData);
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh()
		.register(getProfileData,handleProfileResonse)
		.register(geWolfpacksData,new ResonseHandler("wolfpacks",
				["wolfpacksList"],handleWolfpacksData));
	
	if(name == null) {
		request.request(getProfileData(),handleProfileResonse);
	}		
	
	var topTitle = new TitleArea(name).appendTo(frame);
	
	if(id != eWolf.data("userID")) {
		topTitle.addFunction("Send message...", function (event) {
			var box = new NewMessageBox(id,applicationFrame,id,name);
			box.select();
		});
	}
	
	var idRow = $("<span/>").attr("class","idBox");
	topTitle.appendAtTitleTextArea("&nbsp;");
	topTitle.appendAtTitleTextArea(idRow);
	
	var wolfpacksContainer = new CommaSeperatedList("Wolfpakcs");
	topTitle.appendAtBottomPart(wolfpacksContainer.getList());
	
	if(id != eWolf.data("userID")) {
		topTitle.addFunction("Add to wolfpack...", function () {
			// TODO: add to any wolfpack (not just wall-readers) 
			request.request({
				addWolfpackMember: {
					wolfpackName: "wall-readers",
					userID: id
				}
			},new ResonseHandler("addWolfpackMember",
					[],function (data, textStatus, postData) {
				request.requestAll();
				eWolf.trigger("needRefresh.__pack__"+postData.addWolfpackMember.wolfpackName);
			}));
		});
	} else {
		topTitle.addFunction("Post", function() {
			// TODO: post on wolfpack
			alert("This will post to a wolfpack");
		});
	}
	
	new NewsFeedList(request,newsFeedObj).appendTo(frame);
	
	var profileData = null;
	var wolfpackData = null;
	
	function handleProfileData(data, textStatus, postData) {
		topTitle.setTitle(new User(data.id,data.name));
		idRow.html(data.id);
		
		name = data.name;
		
		while(waitingForName.length > 0) {
			waitingForName.pop()(name);
		}
	  }
	
	function handleWolfpacksData(data, textStatus, postData) {		
		wolfpacksContainer.removeAll();		 

		 $.each(data.wolfpacksList,function(i,pack) {
			 wolfpacksContainer.addItem(new Wolfpack(pack));
		 });
	  }
	
	function getProfileData() {		
		return {
			profile: userObj,
		  };
	}
	
	function geWolfpacksData() {
		return {
			wolfpacks: userObj
		  };
	}
	
	this.getID = function() {
		if(profileData != null) {
			return profileData.id;
		} else {
			return id;
		}			
	};
	
	this.getName = function() {
		if(profileData != null) {
			return profileData.name;
		} else {
			return id;
		}				
	};
	
	this.getWolfpacks = function() {
		if(wolfpackData != null) {
			return wolfpackData.wolfpacksList;
		} else {
			return [];
		}			
	};
	
	this.isSelected = function() {
		return appContainer.isSelected();
	};
	
	this.onReceiveName = function(nameHandler) {
		if(name != null) {
			nameHandler(name);
		} else {
			waitingForName.push(nameHandler);
		}
		
		return obj;
	};
	
	this.destroy = function() {
		eWolf.unbind("refresh."+id);
		appContainer.destroy();
		delete obj;
	};
	
	return this;
};

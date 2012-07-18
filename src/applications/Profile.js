var Profile = function (id,name,applicationFrame) {
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
	
	var title = $("<div/>").appendTo(frame);
	
	var nameTitle = $("<span/>").attr({
		"class" : "eWolfTitle"
	}).appendTo(title);
	
	title.append("&nbsp;");
	
	var idRow = $("<span/>").attr({
		"class": "idBox"
	}).appendTo(title);
	
	title.append("&nbsp;&nbsp;&nbsp; ");
	
	var wolfpacksContainer = $("<span/>").attr({
		"class":"wolfpacksBox"
	}).appendTo(title);	
	
	var wolfpackslist = null;
	
	new NewsFeedList(request,newsFeedObj).appendTo(frame);
	
	var profileData = null;
	var wolfpackData = null;
	
	function handleProfileData(data, textStatus, postData) {
		nameTitle.html(new User(data.id,data.name));
		idRow.html(data.id);
		
		name = data.name;
		
		while(waitingForName.length > 0) {
			waitingForName.pop()(name);
		}
	  }
	
	function handleWolfpacksData(data, textStatus, postData) {		
		if(wolfpackslist != null) {
			 wolfpackslist.remove();
		 }
		 
		 wolfpackslist = $("<span/>").appendTo(wolfpacksContainer);
		 
		 $.each(data.wolfpacksList,function(i,pack) {
			 wolfpackslist.append(new Wolfpack(pack));
			 if(i != data.wolfpacksList.length-1) {
				 wolfpackslist.append(", ");
			 }
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
	
	return {
		getID : function() {
			if(profileData != null) {
				return profileData.id;
			} else {
				return id;
			}			
		},
		getName : function() {
			if(profileData != null) {
				return profileData.name;
			} else {
				return id;
			}				
		},
		getWolfpacks : function() {
			if(wolfpackData != null) {
				return wolfpackData.wolfpacksList;
			} else {
				return [];
			}			
		},
		isSelected : function() {
			return appContainer.isSelected();
		},
		onReceiveName: function(nameHandler) {
			if(name != null) {
				nameHandler(name);
			} else {
				waitingForName.push(nameHandler);
			}
			
			return this;
		},		
		destroy : function() {
			eWolf.unbind("refresh."+id);
			appContainer.destroy();
			delete this;
		}
	};
};

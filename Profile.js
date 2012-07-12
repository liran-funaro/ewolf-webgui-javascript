var Profile = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",handleNewData,null,3600);
	
	var title = $("<div/>").appendTo(frame);
	
	var name = $("<span/>").attr({
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
	
	new NewsFeed(id,frame);
	
	var profileData = null;
	var wolfpackData = null;
	
	getProfileData();

	function handleNewData(data,parameters) {
		console.log(data);
		
		if(data.profile != null) {
			if(data.profile.result == "success") {
				profileData = data.profile;
				
				name.html(new User(data.profile.id,data.profile.name));
				idRow.html(data.profile.id);
			} else {
				console.log(data.profile.result);
			}
			
		} else {
			console.log("No profile parameter in response");
		}
		
		if(data.wolfpacks != null) {
			if(data.wolfpacks.result == "success") {
				wolfpackData = data.wolfpacks;
				
				if(data.wolfpacks.wolfpacksList != null) {
					if(wolfpackslist != null) {
						 wolfpackslist.remove();
					 }
					 
					 wolfpackslist = $("<span/>").appendTo(wolfpacksContainer);
					 
					 $.each(data.wolfpacks.wolfpacksList,function(i,pack) {
						 wolfpackslist.append(new Wolfpack(pack));
						 if(i != data.wolfpacks.wolfpacksList.length-1) {
							 wolfpackslist.append(", ");
						 }
					 });
				} else {
					console.log("No wolfpacksList parameter in response");
				}				
			} else {
				console.log(data.wolfpacks.result);
			}
			
		} else {
			console.log("No wolfpacks parameter in response");
		}
	  }
	
	function getProfileData() {
		var userObj = {};
		
		if(id != eWolf.data("userID")) {
			userObj.userID = id;
		}
		
		request.getData({
			profile: userObj,
			wolfpacks: userObj
		  }, null);
	}
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		if(id == eventId) {
			getProfileData();
		}
	});
	
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
		destroy : function() {
			eWolf.unbind("refresh."+id);
			appContainer.destroy();
			delete this;
		}
	};
};

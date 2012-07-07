var Profile = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();

	var request = new RequestHandler(id,"/json",handleNewData,null,3600);
	
	$("<div/>").attr({
		"class" : "eWolfTitle",
		"id" : id+"Title"
	})	.append("My Profile")
		.appendTo(frame);
	
	var userDetailesContainer = $("<div/>").appendTo(frame);
	var userDetailes = null;
	
	$("<div/>").attr({
		"class" : "eWolfTitle",
		"id" : id+"Title"
	})	.append("My Wolfpacks")
		.appendTo(frame);
	
	var wolfpacksContainer = $("<div/>").appendTo(frame);
	var wolfpackslist = null;

	function handleNewData(data,parameters) {
		console.log(data);
		
		if(data.profile != null) {
			if(data.profile.result == "success") {
				 if(userDetailes != null) {
					 userDetailes.remove();
				 }
				 
				 userDetailes = $("<ul/>").appendTo(userDetailesContainer);
				 $("<li/>").append("<B>Name:</B> " + data.profile.name).appendTo(userDetailes);
				 $("<li/>").append("<B>ID:</B> " + data.profile.id).appendTo(userDetailes);
			} else {
				console.log(data.profile.result);
			}
			
		} else {
			console.log("No profile parameter in response");
		}
		
		if(data.wolfpacks != null) {
			if(data.wolfpacks.result == "success") {
				if(data.wolfpacks.wolfpacksList != null) {
					if(wolfpackslist != null) {
						 wolfpackslist.remove();
					 }
					 
					 wolfpackslist = $("<ul/>").appendTo(wolfpacksContainer);
					 
					 $.each(data.wolfpacks.wolfpacksList,function(i,pack) {
						 $("<li/>").append(pack).appendTo(wolfpackslist);
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
		request.getData({
			profile: {},
			wolfpacks: {}
		  }, null);
	}
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		getProfileData();
	});
	
	return {
		getId : function() {
			return id;
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

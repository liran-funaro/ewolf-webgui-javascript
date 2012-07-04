var Profile = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();

	var profileGetter = new JSonGetter(id,"/json",handleNewData,null,3600);
	
	$("<div/>").attr({
		"class" : "profileTitle",
		"id" : id+"Title"
	})	.append("My Profile")
		.appendTo(frame);
	
	var userDetailesContainer = $("<div/>").appendTo(frame);
	var userDetailes = null;
	
	$("<div/>").attr({
		"class" : "wolfpacksTitle",
		"id" : id+"Title"
	})	.append("My Wolfpacks")
		.appendTo(frame);
	
	var wolfpacksContainer = $("<div/>").appendTo(frame);
	var wolfpackslist = null;

	function handleNewData(data,parameters) {
		console.log(data);
		
		if(data.profile != null) {
			 if(userDetailes != null) {
				 userDetailes.remove();
			 }
			 
			 userDetailes = $("<ul/>").appendTo(userDetailesContainer);
			 $("<li/>").append("<B>Name:</B> " + data.profile.name).appendTo(userDetailes);
			 $("<li/>").append("<B>ID:</B> " + data.profile.id).appendTo(userDetailes);
		}
		
		if(data.wolfpacks != null) {
			if(wolfpackslist != null) {
				 wolfpackslist.remove();
			 }
			 
			 wolfpackslist = $("<ul/>").appendTo(wolfpacksContainer);
			 
			 $.each(data.wolfpacks,function(i,pack) {
				 $("<li/>").append(pack).appendTo(wolfpackslist);
			 });
		}
	  }
	
	function getProfileData() {
		profileGetter.getData({
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

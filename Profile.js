var Profile = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();

	var profileGetter = new JSonGetter(id,"/json?callBack=?",handleNewData,null,3600);
	
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
		  $.each(data,function(i,item){
			 console.log(item.data);
			 
			 if(item.key == "profile") {
				 if(userDetailes != null) {
					 userDetailes.remove();
				 }
				 
				 userDetailes = $("<ul/>").appendTo(userDetailesContainer);
				 $("<li/>").append("<B>Name:</B> " + item.data.name).appendTo(userDetailes);
				 $("<li/>").append("<B>ID:</B> " + item.data.id).appendTo(userDetailes);
			 } 
			 
			 if(item.key == "wolfpacks") {
				 if(wolfpackslist != null) {
					 wolfpackslist.remove();
				 }
				 
				 wolfpackslist = $("<ul/>").appendTo(wolfpacksContainer);
				 
				 $.each(item.data,function(i,pack) {
					 $("<li/>").append(pack).appendTo(wolfpackslist);
				 });
			 }
		  }); 
	  }
	
	function getProfileData() {
		/*!
		 * The parameters should be:
		 * 	0:	user ID or the key word “my” if we want the logged in user wolfpacks.
		 */
		profileGetter.getData({
			profile: "my",
			wolfpacks: "my"
		  }, {
			  // No data to pass to handler
		  });
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

var Profile = function (id,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();

	var eWolfJsonGetter = new JSonGetter(id,"/json?callBack=?",handleNewData,null,0);
	
	$("<div/>").attr({
		"class" : "profileTitle",
		"id" : id+"Title"
	})	.append("My Profile")
		.appendTo(frame);
	
	var userDetailesContainer = $("<div/>").appendTo(frame);
	var userDetailes = null;

	function handleNewData(data,parameters) {		  
		  $.each(data,function(i,item){
			 if(item.key == "profile") {
				 console.log(item.data);
				 if(userDetailes != null) {
					 userDetailes.remove();
				 }
				 
				 userDetailes = $("<ul/>").appendTo(userDetailesContainer);
				 $("<li/>").append("<B>Name:</B> " + item.data.name).appendTo(userDetailes);
				 $("<li/>").append("<B>ID:</B> " + item.data.id).appendTo(userDetailes);
			 } 
		  }); 
	  }
	
	function getProfileData() {
		/*!
		 * The parameters should be:
		 * 	0:	user ID or the key word “my” if we want the logged in user wolfpacks.
		 */
		eWolfJsonGetter.getData({
			profile: "my"
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

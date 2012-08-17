var Profile = function (id,name,applicationFrame) {
	var self = this;
	
	Application.call(this,id,applicationFrame);
	
	var waitingForName = [];
	
	var userObj = {};
	
	if(id != eWolf.data("userID")) {
		userObj.userID = id;
	}
	
	var handleProfileResonse = new ResponseHandler("profile",
			["id","name"],handleProfileData)
		.error(onProfileNotFound);
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh()
		.register(getProfileData,handleProfileResonse.getHandler())
		.register(geWolfpacksData,new ResponseHandler("wolfpacks",
				["wolfpacksList"],handleWolfpacksData).getHandler());
	
	var topTitle = new TitleArea("Searching profile...").appendTo(this.frame);
	
	var idBox = $("<span/>").addClass("idBox");
	topTitle.appendAtTitleTextArea(idBox);
	
	var wolfpacksContainer = new CommaSeperatedList("Wolfpakcs");
	topTitle.appendAtBottomPart(wolfpacksContainer.getList());
	
	if(id != eWolf.data("userID")) {
		topTitle.addFunction("Send message...", function (event) {
			new NewMessage(id,applicationFrame,id,name).select();
		});
		
		topTitle.addFunction("Add to wolfpack...", function () {
			new AddToWolfpack(id, self.frame, this, request, wolfpacksContainer.getItemNames());
			return false;
		});
	} else {
		topTitle.addFunction("Post", function() {
			new NewPost(id,applicationFrame).select();
		});
	}
	
	topTitle.hideAll();
	
	var newsFeed = null;
	
	if(name == null) {
		request.request(getProfileData(),
				handleProfileResonse.getHandler());
	} else {
		onProfileFound();
	}
	
	function onProfileFound() {		
		topTitle.setTitle(CreateUserBox(id,name));
		idBox.html(id);
		
		topTitle.showAll();
		
		if(newsFeed == null) {			
			newsFeed = new ProfileNewsFeedList(request,id)
				.appendTo(self.frame);
		} 	
		
		while(waitingForName.length > 0) {
			waitingForName.pop()(name);
		}
	}
	
	function onProfileNotFound() {
		topTitle.setTitle("Profile not found");
		idBox.html();
		
		topTitle.hideAll();
		
		if(newsFeed != null) {			
			newsFeed.destroy();
			newsFeed = null;
		} 
	}
	
	function handleProfileData(data, textStatus, postData) {		
		name = data.name;
		onProfileFound();
	}
	
	function handleWolfpacksData(data, textStatus, postData) {		
		wolfpacksContainer.removeAll();		 

		 $.each(data.wolfpacksList,function(i,pack) {
			 wolfpacksContainer.addItem(CreateWolfpackBox(pack),pack);
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
	
	this.onReceiveName = function(nameHandler) {
		if(name != null) {
			nameHandler(name);
		} else {
			waitingForName.push(nameHandler);
		}
		
		return self;
	};
	
	return this;
};

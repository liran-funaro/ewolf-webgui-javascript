var Profile = function (id,userID,userName,applicationFrame) {
	var self = this;
	
	Application.call(this,id,applicationFrame);
	
	var waitingForName = [];
	
	var userObj = {};
	
	if(userID != eWolf.userID) {
		userObj.userID = userID;
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
	
	if(userID != eWolf.userID) {
		topTitle.addFunction("Send message...", function (event) {
			new NewMessage(id,applicationFrame,userID,userName).select();
		});
		
		topTitle.addFunction("Add to wolfpack...", function () {
			new AddToWolfpack(id, userID,self.frame, this, request, wolfpacksContainer.getItemNames());
			return false;
		});
	} else {
		topTitle.addFunction("Post", function() {
			new NewPost(id,applicationFrame).select();
		});
	}
	
	topTitle.hideAll();
	
	var newsFeed = null;
	
	if(userName == null) {
		request.request(getProfileData(),
				handleProfileResonse.getHandler());
	} else {
		onProfileFound();
	}
	
	function onProfileFound() {		
		topTitle.setTitle(CreateUserBox(userID,userName));
		idBox.html(userID);
		
		topTitle.showAll();
		
		if(newsFeed == null) {			
			newsFeed = new ProfileNewsFeedList(request,userID)
				.appendTo(self.frame);
		} 	
		
		while(waitingForName.length > 0) {
			waitingForName.pop()(userName);
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
		userName = data.name;
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
		if(userName != null) {
			nameHandler(userName);
		} else {
			waitingForName.push(nameHandler);
		}
		
		return self;
	};
	
	return this;
};

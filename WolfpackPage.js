var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
		
	var title = $("<div/>").appendTo(frame);
	
	$("<span/>").attr({
		"class" : "eWolfTitle"
	}).append(new Wolfpack(wolfpackName)).appendTo(title);
	
	new NewsFeedList(id,{
		newsOf:"wolfpack",
		wolfpackName:wolfpackName
	}).appendTo(frame);
	
	return {
		getID : function() {
			return id;			
		},
		getName : function() {
			return wolfpackName;			
		},
		isSelected : function() {
			return appContainer.isSelected();
		},
		destroy : function() {
			appContainer.destroy();
			delete this;
		}
	};
};

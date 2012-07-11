var NewsFeed = function (id, applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	var mailObject = {
			text: "hello liran",
			attachment: [{
				filename: "testfile.doc",
				contentType: "document",
				path: "http://www.google.com"
			},
			{
				filename: "image.jpg",
				contentType: "image/jpeg",
				path: "https://www.cia.gov/library/publications/the-world-factbook/graphics/flags/large/is-lgflag.gif"					
			}]
	};
	
//	var msgBox = MailItem(mailObject);
//	msgBox.appendTo(frame);
	
	var list = $("<ul/>").attr({
		"id" : id,
		"class" : "messageList"
	})	.appendTo(frame);
	
	var obj = new GenericItem("__genericitem__","Liran",
			"1234",1234,JSON.stringify(mailObject),"","","",false);

	obj.appendTo(list);	
};
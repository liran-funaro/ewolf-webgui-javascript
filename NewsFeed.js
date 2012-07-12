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
		"class" : "postList"
	})	.appendTo(frame);
	
	var obj = new GenericItem("__genericitem__","Liran",
			"model",1234,JSON.stringify(mailObject),"postListItem","postBox","",false);

	obj.appendTo(list);
	
	obj = new GenericItem("__genericitem__","Liran",
			"cat",1234,JSON.stringify(mailObject),"postListItem","postBox","",false);

	obj.appendTo(list);	
};
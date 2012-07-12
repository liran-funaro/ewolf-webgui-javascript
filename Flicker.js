var Flicker = function (key,applicationFrame) {
	var appContainer = new AppContainer(key,applicationFrame);
	var frame = appContainer.getFrame();
	var id = appContainer.getId();
	var newestData = new Date(0);
	var oldestData = new Date(new Date()+7);
	var showMore = new ShowMore(frame,function() {
		updateFromServer(true);
	});
	
	var request = new JSONRequestHandler(id,
			"http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			handleNewData,null,60);
	
	function addItem(published,title,srcImg,link,afterItem) {
		var olderItem = false;
		
		if(published - oldestData < 0) {
			oldestData = published;
			olderItem = true;
		}
		
		if(published - newestData > 0) {
			newestData = published;
			olderItem = false;
		}
		
		return drawItem(title,srcImg,link,afterItem,olderItem);
	}
	
	
	function addItemsAraay(items,olderItems) {
		var currentNewestData = newestData;
		var currentOldestData = oldestData;
		var lastItem = null;
		var itemsCreated = 0;
		
	    $.each(items, function(i,item){
	    	var published = new Date(item.published);
	    	
	    	var addTheItem = false;
	    	
	    	if(olderItems) {
	    		addTheItem = published - currentOldestData < 0;
	    	} else {
	    		addTheItem = published - currentNewestData > 0;
	    	}
	    	
	    	if(addTheItem) {
	    		lastItem = addItem(published,item.title, item.media.m,
	    				item.link,lastItem);
	    		
	    		itemsCreated++;
	    		if(itemsCreated > 7) {
	    			// break the "each loop"
					showMore.draw();
	    			return false;
	    		}
	    	}
	    });
	}
	
	
	function drawItem(title,srcImg,link,afterItem,olderItem) {
		var aObj = $("<a/>").attr({
			href: link,
			target: "_TRG_"+title
		});
		
		$("<img/>").attr({
			"src": srcImg,
			style: "padding:5px 5px 5px 5px; height:130px;"
		}).appendTo(aObj);
				
		if(afterItem == null) {
			if(olderItem) {
				frame.append(aObj);
			} else {
				frame.prepend(aObj);
			}
		} else {
			afterItem.after(aObj);
		}
		
		var space = $("<em/>").append("&nbsp;");
		aObj.after(space);
		
		return space;
	}
	
	function handleNewData(data,parameters) {
		console.log(data);

		if (parameters.getOlderItems) {
			showMore.remove();
		}

		addItemsAraay(data.items, parameters.getOlderItems);
	}

	function updateFromServer(getOlderItems) {		
		request.getData(
		  {
		    tags: id,
		    tagmode: "any",
		    format: "json"
		  }, {
			  getOlderItems: getOlderItems
		  });
	}
	
	eWolf.bind("refresh."+id,function(event,eventId) {
		if(id == eventId) {
			updateFromServer(false);
		}
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
			eWolf.unbind("select."+id);
			appContainer.destroy();
			delete this;
		}
	};
};

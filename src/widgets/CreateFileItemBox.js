function CreateFileItemBox(name,type,size,file) {
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	var box =  $("<div/>")
				.addClass("fileItemBox");
	
	var attachImage = $("<img/>").attr({
		"src" : eWolf.IMAGE_PAPER_CLIP,
		"align" : "absmiddle",
		"vertical-align" : "middle"
	})	.addClass("fileItemThunmnailImage")
			.appendTo(box);
	
	$("<span/>")
			.addClass("fileItemFileNameBox")
			.append(name)
			.appendTo(box);
	
	if(type) {
		$("<span/>")
					.addClass("fileItemExtraDataBox")
					.append("(" + type + ")")
					.appendTo(box);
	}
	
	if(size) {
		var fileSize = 0;
	    if (size > 1024 * 1024) {
	    	fileSize = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	    } else {
	    	fileSize = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
	    }
	    
	   if(!type) {
		   fileSize =  "(" + fileSize + ")";
	   }
		
		$("<span/>")
				.addClass("fileItemExtraDataBox")
				.append(fileSize)
				.appendTo(box);
	}
	
	if(file && file.type.substring(0,5) == "image") {
		new ThumbnailImageFromFile(file,file.name,
				0.7,100,50,function(img) {
			attachImage.remove();
			img	.attr({
						"align" : "absmiddle"
					})
					.addClass("fileItemThunmnailImage");
			
			box.prepend(img);
		});
	}
	
	return box;
}
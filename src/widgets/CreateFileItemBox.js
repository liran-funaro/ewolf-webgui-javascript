function CreateFileItemBox(name,type,size,file) {
	var box =  $("<div/>").css({
		"display": "inline-block"
	});
	
	var attachImage = $("<img/>").attr({
		"src" : "/Paperclip.png",
		"align" : "absmiddle",
		"vertical-align" : "middle"
	}).css({
		"margin-right" : "3px"
	}).appendTo(box);
	
	$("<span/>").css({
		"white-space" : "normal"
	}).append(name).appendTo(box);
	
	if(type) {
		$("<span/>").css({
			"text-align" : "right",
			"font-size" : "10px",
			"margin-left" : "5px"
		}).append("(" + type + ")").appendTo(box);
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
		
		$("<span/>").css({
			"text-align" : "right",
			"font-size" : "10px",
			"margin-left" : "5px"
		}).append(fileSize).appendTo(box);
	}
	
	if(file && file.type.substring(0,5) == "image") {
		new ThumbnailImageFromFile(file,file.name,
				0.7,100,50,function(img) {
			attachImage.remove();
			img.attr({
				"align" : "absmiddle"
			}).css({
				"margin-right" : "3px"
			});
			box.prepend(img);
		});
	}
	
	return box;
}
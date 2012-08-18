function CreateMailItemBox(mailObj) {
	var text = mailObj.text;
	var canvas = $("<div/>").html(text);
	canvas.linkify();
	canvas.addYouTubeEmbeded();

	if(mailObj.attachment != null) {
		var imageCanvas = $("<div/>");
		var attachList = $("<div/>").css({
			"margin-left" : "5px"
		});
		
		$.each(mailObj.attachment, function(i, attach) {
			if(attach.contentType.substring(0,5) == "image") {
				var aObj = $("<a/>").attr({
					href: attach.path,
					target: "_TRG_"+attach.filename
				}).appendTo(imageCanvas);
				
				new ThumbnailImage(attach.path,attach.filename,
						0.7,200,100,function(img) {
					img.css({
						"padding" : "5px 5px 5px 5px"
					}).appendTo(aObj);
					
					$("<em/>").append("&nbsp;").appendTo(imageCanvas);
				});
				
			} else {
				var li = $("<li/>").appendTo(attachList);
				
				$("<a/>").attr({
					href: attach.path,
					target: "_TRG_"+attach.filename
				}).append(CreateFileItemBox(attach.filename,
						attach.contentType,attach.size))
					.appendTo(li);
			}
		});
		
		if(! imageCanvas.is(":empty")) {
			imageCanvas.appendTo(canvas);
		}
		
		if(! attachList.is(":empty")) {
			var line = $("<hr/>").css({
				"color" : "#AAA",
				"background-color" : "#AAA",
				"height" : "1px",
				"border" : "0"
			});
			
			$("<div/>")
				.append(line)
				//.append("Attachments:")
				.append(attachList)
				.appendTo(canvas);
		}
	}	
	
	return canvas;
}

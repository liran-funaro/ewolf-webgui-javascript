var ThumbnailImage = function (src,altText,quality,maxWidth,maxHeight,onReady) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var image = new Image();
	image.src = src;

	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	image.onload = function() {
		var imageWidth = image.width,
			imageHeight = image.height;

		if (imageWidth > imageHeight) {
			if (imageWidth > maxWidth) {
				imageHeight *= maxWidth / imageWidth;
				imageWidth = maxWidth;
			}
		} else {
			if (imageHeight > maxHeight) {
				imageWidth *= maxHeight / imageHeight;
				imageHeight = maxHeight;
			}
		}

		var canvas = document.createElement('canvas');
		canvas.width = imageWidth;
		canvas.height = imageHeight;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

		var data;
		try {
			data = canvas.toDataURL("image/jpeg",quality);
		} catch(e) {
			data = src;
		}
		
		var result = $("<img/>").attr({
			"src": data,
			"alt" : altText
		}).css({
			"max-width" : maxWidth+"px",
			"max-height" : maxHeight+"px"
		});
		
		onReady(result);
	};
};

var ThumbnailImageFromFile = function(file,altText,quality,maxWidth,maxHeight,onReady) {
	var reader = new FileReader();

	reader.onloadend = function() {
		ThumbnailImage.call(this,reader.result,altText,quality,maxWidth,maxHeight,onReady);
	};

	reader.readAsDataURL(file);
};
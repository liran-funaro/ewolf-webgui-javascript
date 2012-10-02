var Tag = function(id,onRemove,removable,multirow,withImage) {
	var box = $("<p/>").addClass("TagClass");
	
	if(!removable) {
		box.addClass("TagNonRemoveable");
	}
	
	if(!multirow) {
		box.addClass("TagNoMultiRow");
	}

	$("<div/>").addClass("TagDeleteClass")
		.append("&times;")
		.appendTo(box)
		.click(function() {
			box.remove();
		
			if(onRemove) {
				onRemove(id);
			}
		});
	
	if(withImage) {
		box.addClass("TagWithImage");
	}
	
	box.data("initProgressBar", function() {
		var progress = $("<div/>").appendTo(box);
		
		progress.progressbar({ disabled: true });
		progress.css({
			"width" : "100%",
			"height" : "100%",
			"class" : "ui-progressbar",
			"z-index" : "1"
		});
		
		progress.children("div").css({
			'background': '#001a00'
		});
		
		box.children(":not(.ui-progressbar)").css({
			"position" : "relative",
			"z-index" : "999"
		});
		
		box.data("setProgress", function (prec) {
			progress.progressbar({ value: prec });
		});
		
		box.data("removeProgressBar", function() {
			progress.remove();
		});
	});	
	
	return box;
};
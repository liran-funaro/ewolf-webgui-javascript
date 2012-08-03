var Tag = function(id,onRemove,removable,multirow) {
	var box = $("<p/>").attr({
		"class" : "TagClass"
	});	
	
	if(!removable) {
		box.addClass("TagNonRemoveable");
	}
	
	if(!multirow) {
		box.addClass("TagNoMultiRow");
	}

	var x = $("<div/>").attr({
		"class" : "TagDeleteClass"
	}).append("&times;").appendTo(box).click(function() {
		if(onRemove) {
			onRemove(id);
		}
		
		box.remove();
	});
	
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
			'background': 'rgb(10,45,10)'
		});
		
		box.children(":not(.ui-progressbar)").css({
			"position" : "relative",
			"z-index" : "999"
		});
		
		box.data("setProgress", function (prec) {
			progress.progressbar({ value: prec });
		});
	});	
	
	return box;
};
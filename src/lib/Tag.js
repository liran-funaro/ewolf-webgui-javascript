var Tag = function(id,onRemove,removable) {
	var box = $("<p/>").attr({
		"class" : "TagClass"
	});
	
	if(!removable) {
		box.addClass("TagNonRemoveable");
	}

	$("<span/>").attr({
		"class" : "TagDeleteClass"
	}).append("&times;").appendTo(box).click(function() {
		if(onRemove) {
			onRemove(id);
		}
		
		box.remove();
	});
	
	return box;
};
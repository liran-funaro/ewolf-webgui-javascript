function CreateFileItemBox(file) {
	var left = $("<div/>").css({
		"text-align" : "left",
		"display": "inline-block"
	}).append(file.name);
	
	var fileSize = 0;
    if (file.size > 1024 * 1024) {
    	fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    } else {
    	fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
    } 
	
	var right = $("<div/>").css({
		"text-align" : "right",
		"font-size" : "10px",
		"display": "inline-block",
		"margin-left" : "5px"
	}).append("(" + fileSize + ")");
	
	return $("<div/>").css({
		"display": "inline-block"
	}).append(left).append(right);
}
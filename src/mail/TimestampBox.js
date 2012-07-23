var TimestampBox = function(timestamp) {
	var itsTime = new Date(timestamp);
	
	return $("<span/>").attr({
		"class": "timestampBox"
	}).append(itsTime.toString(dateFormat));
};

var dateFormat = "dd/MM/yyyy (HH:mm)";
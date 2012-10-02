DATE_FORMAT = "dd/MM/yyyy (HH:mm)";

function CreateTimestampBox(timestamp) {	
	return $("<span/>").addClass("timestampBox")
		.append(new Date(timestamp).toString(DATE_FORMAT));
}
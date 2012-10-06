var RESPONSE_RESULT = {
		SUCCESS :				"SUCCESS",
			//	if everything went well.
		BAD_REQUEST :			"BAD_REQUEST",
			//	Missing an obligatory parameter.
			//	Wrong type or format parameter.
		INTERNAL_SERVER_ERROR :	"INTERNAL_SERVER_ERROR", 
			//for any internal server error.
		ITEM_NOT_FOUND :		"ITEM_NOT_FOUND",
			//	if the requested item did not found (for any reason).
		GENERAL_ERROR :			"GENERAL_ERROR",
			// for errors from unknown reason (no one of above)
		UNAVAILBLE_REQUEST :	"UNAVAILBLE_REQUEST",
			// if the request category is unavailable or not exists.
};

var GenericResponse = function (obj) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;	
	$.extend(this,obj);
	
	var UNDEFINED_RESULT = "undifined result";
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.isSuccess = function() {
		if(self.result) {
			return self.result == RESPONSE_RESULT.SUCCESS;
		} else {
			return false;
		}		
	};
	
	this.isGeneralError = function() {
		if(self.result) {
			return self.result == RESPONSE_RESULT.GENERAL_ERROR;
		} else {
			return false;
		}		
	};
	
	this.toString = function() {
		if((!self.result) && (!self.errorMessage)) {
			return UNDEFINED_RESULT;
		} else if(!self.result) {
			return self.errorMessage;
		} else if(!self.errorMessage) {
			return self.result;
		} else {
			return self.result + " : " + self.errorMessage;
		}
	};
	
	
	return this;
};
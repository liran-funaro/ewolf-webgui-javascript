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

var ResponseHandler = function(category, requiredFields, handler) {
	var thisObj = this;
	
	var errorHandler = null;
	var completeHandler = null;
	var badResponseHandler = null;
	
	function theHandler(data, textStatus, postData) {
		if (data[category] != null) {
			if (data[category].result == RESPONSE_RESULT.SUCCESS) {
				var valid = true;
				$.each(requiredFields, function(i, field) {
					if (field == null) {
						console.log("No field: \"" + field + "\" in response");
						valid = false;
						return false;
					}
				});

				if (valid && handler) {
					handler(data[category], textStatus, postData[category]);
				}
			} else {
				console.log(data[category].result + " : " +
						data[category].errorMessage);
				if(errorHandler) {
					errorHandler(data[category], textStatus, postData[category]);
				}
			}

		} else {
			var errorMsg = "No category: \"" + category + "\" in response";
			console.log(errorMsg);
			
			if(badResponseHandler) {
				badResponseHandler(errorMsg, textStatus, postData[category]);
			}
		}
		
		if(completeHandler) {
			completeHandler(textStatus, postData[category]);
		}		
	};
	

	this.getHandler = function() {
		return theHandler;
	};
	
	this.error = function (newErrorHandler) {
		errorHandler = newErrorHandler;
		return thisObj;
	};
	
	this.success = function (newSuccessHandler) {
		handler = newSuccessHandler;
		return thisObj;
	};
	
	this.complete = function (newCompleteHandler) {
		completeHandler = newCompleteHandler;
		return thisObj;
	};
	
	this.badResponseHandler = function (newBadResponseHandler) {
		badResponseHandler = newBadResponseHandler;
		return thisObj;
	};
	
	return this;
};
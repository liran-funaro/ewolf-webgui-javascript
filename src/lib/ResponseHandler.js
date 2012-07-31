var ResponseHandler = function(category, requiredFields, handler) {
	var errorHandler = null;
	var completeHandler = null;
	var badResponseHandler = null;
	
	function theHandler(data, textStatus, postData) {
		if (data[category] != null) {
			if (data[category].result == "success") {
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
				console.log("Response unsuccesssful: " + data[category].result);
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
	
	return {
		getHandler: function() {
			return theHandler;
		},
		error: function (newErrorHandler) {
			errorHandler = newErrorHandler;
			return this;
		},		
		success: function (newSuccessHandler) {
			handler = newSuccessHandler;
			return this;
		},		
		complete: function (newCompleteHandler) {
			completeHandler = newCompleteHandler;
			return this;
		},
		badResponseHandler: function (newBadResponseHandler) {
			badResponseHandler = newBadResponseHandler;
			return this;
		}
	};
};
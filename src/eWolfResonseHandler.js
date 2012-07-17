var eWolfResonseHandler = function(category, requiredFields, handler) {
	return function(data, textStatus, postData) {
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

				if (valid) {
					handler(data[category], textStatus, postData);
				}
			} else {
				console.log("Response unsuccesssful: " + data[category].result);
			}

		} else {
			console.log("No category: \"" + category + "\" in response");
		}
	};
};
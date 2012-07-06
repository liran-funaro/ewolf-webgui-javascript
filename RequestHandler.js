var RequestHandler = function(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec) {
	var timer = null;
			
	function onPostComplete() {
		if(onComplete != null) {
			onComplete(passToHandler);
		}

		eWolf.trigger("loadingEnd",[id]);
		
		if(refreshIntervalSec > 0) {
			timer = setTimeout("eWolf.trigger('needRefresh."+id+"'," +
					"["+id+"])",refreshIntervalSec*1000);
		}
	}
	
	
	return {
		getId : function() {
			return id;
		},
		setRequestAddress : function(inputRequestAddress) {
			requestAddress = inputRequestAddress;
		},
		getData : function (data, passToHandler) {
			clearTimeout(timer);
			eWolf.trigger("loading",[id]);				
			
			$.post(	requestAddress,
				JSON.stringify(data),
				function(receivedData,textStatus) {
					handleDataFunction(receivedData,/*textStatus,*/passToHandler);
				},
				"json").complete(onPostComplete);
		}
	};
};
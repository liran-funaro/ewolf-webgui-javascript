var JSonGetter = function(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec) {
		var timer = null;
		
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
				
				$.getJSON(requestAddress,data, function(inputData) {
					handleDataFunction(inputData,passToHandler);
				}) .complete( function(){
						if(onComplete != null) {
							onComplete(passToHandler);
						}

						eWolf.trigger("loadingEnd",[id]);
						if(refreshIntervalSec > 0) {
							timer = setTimeout("eWolf.trigger('needRefresh."+id+"'," +
									"["+id+"])",refreshIntervalSec*1000);
						}
					});
			}
		};
};
var BasicRequestHandler = function(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec) {
	
	function trigger() {
		eWolf.trigger('needRefresh.'+id,[id]);
	}	
	
	return {
		_timer: null,
		_onPostComplete: function () {
			if(onComplete != null) {
				onComplete();
			}

			eWolf.trigger("loadingEnd",[id]);
			
			if(refreshIntervalSec > 0) {
				clearTimeout(this._timer);
				this._timer = setTimeout(trigger,refreshIntervalSec*1000);
			}
		},
		getId : function() {
			return id;
		},
		setRequestAddress : function(inputRequestAddress) {
			requestAddress = inputRequestAddress;
		}
	};
};

var PostRequestHandler = function(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec) {
	var res = new BasicRequestHandler(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec);
	res.getData = function (data) {
		clearTimeout(this._timer);
		eWolf.trigger("loading",[id]);				
		
		$.post(	requestAddress,
			JSON.stringify(data),
			function(receivedData,textStatus) {
				handleDataFunction(receivedData,/*textStatus,*/data);
			},
			"json").complete(this._onPostComplete);
	};
	
	return res;
};

var JSONRequestHandler = function(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec) {
	var res = new BasicRequestHandler(id,requestAddress,handleDataFunction,onComplete,refreshIntervalSec);
	res.getData = function (data) {
		clearTimeout(this._timer);
		eWolf.trigger("loading",[id]);				
		
		$.getJSON(
				requestAddress,
				data,
				function(receivedData,textStatus) {
					handleDataFunction(receivedData,/*textStatus,*/data);
				}).complete(this._onPostComplete);
	};
	
	return res;
};
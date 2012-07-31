var Loading = function(indicator) {
	var loadingCount = 0;
	
	function startLoading() {
		loadingCount++;
		indicator.spin(spinnerOpts);
		indicator.show(200);
	}
	
	function stopLoading() {
		indicator.hide(200);
		indicator.data('spinner').stop();
		loadingCount--;
	}
	
	eWolf.bind("loading",startLoading);	
	eWolf.bind("loadingEnd",stopLoading);


	return {
		listenToEvent : function(eventStart,eventEnd) {
			eWolf.bind(eventStart,startLoading);	
			eWolf.bind(eventEnd,stopLoading);
		},
		stopListenToEvent : function(eventStart,eventEnd) {
			eWolf.unbind(eventStart,startLoading);	
			eWolf.unbind(eventEnd,stopLoading);
		}
	};
};

var spinnerOpts = {
  lines: 10, // The number of lines to draw
  length: 4, // The length of each line
  width: 2, // The line thickness
  radius: 3, // The radius of the inner circle
  rotate: 0, // The rotation offset
  color: '#fff', // #rgb or #rrggbb
  speed: 0.8, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 0, // Top position relative to parent in px
  left: 0 // Left position relative to parent in px
};

$.fn.spin = function(opts) {
	this.each(function() {
		var $this = $(this), data = $this.data();

		if (data.spinner) {
			data.spinner.stop();
			delete data.spinner;
		}
		if (opts !== false) {
			data.spinner = new Spinner($.extend({
				color : $this.css('color')
			}, opts)).spin(this);
		}
	});
	return this;
};
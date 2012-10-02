var ApplicationUI = function(container,titleText) {
	UI.call(this);
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.frame = $("<div/>")
			.addClass("applicationContainer")
			.append(this.context)
			.appendTo(container)
			.hide();
	
	this.title = new TitleArea(titleText).appendTo(this.frame);
	
	return this;
};
function Application(id,container,menu,menuList,loadingFrame) {
	this.id = id;
	this.container = container;
	this.menu = menu;
	this.menuList = menuList;
	this.loadingFrame = loadingFrame;
	this.loader = null;
	
	this.loading = false;
	
	this.frame = $("<div/>").attr({
		"id": this.id+"ApplicationFrame"
	})	.hide()
		.data('applicationItem',this)
		.appendTo(this.container);
	
	return this;
}

Application.prototype.appendLoader = function(loader) {
	this.loader = loader;
};

Application.prototype.isNeedRefresh = function() {
	return this.frame.is(":empty");
};

Application.prototype.isLoading = function() {
	return this.loading;
};

Application.prototype.appear = function() {
	this.container.children("div").slideUp(700);	
	this.frame.slideDown(700);
};

Application.prototype.setLoading = function() {
	this.loading = true;	
	if(this.loader != null) {
		this.loader.showLoading();
	}
};

Application.prototype.clearLoading = function() {
	if(this.loader != null) {
		this.loader.hideLoading();
    }
    
	this.loading = false;
};

Application.prototype.refresh = function () {
	
};
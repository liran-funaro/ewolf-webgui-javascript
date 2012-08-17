var SideMenu = function(menu, mainFrame,topbarFrame) {
	var thisObj = this;
	
	var itemSpace = menu.children("#menuItemsSpace");
	
	var toggleButton = menu.children("#toggleButtons");

	var hideBtn = toggleButton.children("#btnHideMenu"),
		showBtn = toggleButton.children("#btnShowMenu"),
		pinBtn = toggleButton.children("#btnPin"),
		unpinBtn = toggleButton.children("#btnUnPin"),
		menuLists = [];
	
	this.showMenu = function (){
		showBtn.hide();
		thisObj.menuIn();
		thisObj.mainFrameShrink();
		hideBtn.show();
	};

	this.hideMenu = function () {
		hideBtn.hide();
		thisObj.menuOut();
		thisObj.mainFrameGrow();
		showBtn.show();
	};

	this.pinMenu = function () {
		thisObj.mainFrameShrink();
		pinBtn.hide();
		unpinBtn.show();
		hideBtn.show();
		menu.unbind("mouseover");
		menu.unbind("mouseout");
	};

	this.unpinMenu = function () {
		thisObj.mainFrameGrow();
		unpinBtn.hide();
		pinBtn.show();
		hideBtn.hide();
		menu.mouseover(thisObj.menuIn);
		menu.mouseout(thisObj.menuOut);
	};

	this.menuOut = function () {
		menu.stop();
		itemSpace.stop();

		menu.animate({
			opacity : 0.25,
			left : '-175px',
		}, 200, function() {
			itemSpace.animate({
				opacity : 0
			}, 200, function() {
				// Animation complete
			});
		});
	};

	this.menuIn = function () {
		menu.stop();
		itemSpace.stop();

		menu.animate({
			opacity : 0.7,
			left : '-35px',
		}, 200, function() {
			// Animation complete
		});
		
		itemSpace.animate({
			opacity : 1,
		}, 400, function() {
			// Animation complete
		});
		
	};

	this.mainFrameGrow = function () {
		mainFrame.stop();

		mainFrame.animate({
			left : '30px',
			right : '0'
		}, 200, function() {
			eWolf.trigger("mainFrameResize",["sideMenu"]);
		});
	};

	this.mainFrameShrink = function () {
		mainFrame.stop();

		mainFrame.animate({
			left : '170px',
			right : '0'
		}, 200, function() {
			eWolf.trigger("mainFrameResize",["sideMenu"]);
		});
	};
	
	$(window).resize(function() {
		eWolf.trigger("mainFrameResize",["window"]);
	});
	
	this.append = function(item) {
		itemSpace.append(item);
	};
	
	this.createNewMenuList = function(id, title) {
		var menuLst = new MenuList(id,title,topbarFrame)
			.appendTo(itemSpace);
		menuLists.push(menuLst);
		return menuLst;
	};
	
	hideBtn.click(this.hideMenu);
	showBtn.click(this.showMenu);
	pinBtn.click(this.pinMenu);
	unpinBtn.click(this.unpinMenu);
	
	return this;
};
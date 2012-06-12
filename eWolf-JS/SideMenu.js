var SideMenu = function(menu, mainFrame,topbarFrame) {
	menu.data('menuObj', this);
	mainFrame.data('menuObj', this);
	var toggleButton = menu.children("#toggleButtons");

	var hideBtn = toggleButton.children("#btnHideMenu")
			.data('menuObj', this).click(function() {
				hideMenu();
			}),
		showBtn = toggleButton.children("#btnShowMenu")
			.data('menuObj', this).click(function() {
				showMenu();
			}),
		pinBtn = toggleButton.children("#btnPin")
			.data('menuObj', this).click(function() {
				pinMenu();
			}),
		unpinBtn = toggleButton.children("#btnUnPin")
			.data('menuObj', this).click(function() {
				unpinMenu();
			}),

		menuLists = [];
	
	function showMenu() {
		showBtn.hide();
		menuIn();
		mainFrameShrink();
		hideBtn.show();
	};

	function hideMenu() {
		hideBtn.hide();
		menuOut();
		mainFrameGrow();
		showBtn.show();
	};

	function pinMenu() {
		mainFrameShrink();
		pinBtn.hide();
		unpinBtn.show();
		hideBtn.show();
		menu.unbind("mouseover");
		menu.unbind("mouseout");
	};

	function unpinMenu() {
		mainFrameGrow();
		unpinBtn.hide();
		pinBtn.show();
		hideBtn.hide();
		menu.mouseover(function() {
			menuIn();
		});

		menu.mouseout(function() {
			menuOut();
		});
	};

	function menuOut() {
		menu.stop();

		menu.animate({
			opacity : 0.25,
			left : '-175px',
		}, 200, function() {
			// Animation complete.
		});
	};

	function menuIn() {
		menu.stop();

		menu.animate({
			opacity : 0.7,
			left : '-35px',
		}, 200, function() {
			// Animation complete.
		});
	};

	function mainFrameGrow() {
		mainFrame.stop();

		mainFrame.animate({
			left : '30px',
			right : '0'
		}, 200, function() {
			eWolf.trigger("mainFrameResize",["sideMenu"]);
		});
	};

	function mainFrameShrink() {
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
	
	return {
		append : function(item) {
			menu.append(item);
		},
		createNewMenuList : function(id, title) {
			var menuLst = new MenuList(this,id,title,topbarFrame)
							.appendTo(menu);
			menuLists.push(menuLst);
			return menuLst;
		}
	};
};
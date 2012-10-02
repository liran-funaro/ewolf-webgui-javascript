CREATE_NEW_WOLFPACK_LINK_CONSTANTS = {
	QUERY_ID : "query"	
};

var CreateNewWolfpackLink = function() {
	var self = this;
	$.extend(this,CREATE_NEW_WOLFPACK_LINK_CONSTANTS);
	
	var link = $("<a/>").append("+ Create Wolfpack");	
	var li = $("<li/>").append(link).click(function() {
		var diag = $("<div/>").attr({
			"id" : "dialog-confirm",
			"title" : "Create a new wolfpack"
		}).addClass("DialogClass");
		
		var line = $("<p/>").append("New wolfpack name: ").appendTo(diag);
		
		var query = $("<input/>").attr({
			"type": "text",
			"placeholder": "Wolfpack name"
		}).css({
			"min-width" : 200
		}).appendTo(line);		
		
		var errorBox = $("<span/>").addClass("errorArea").appendTo(diag);
		
		var formValidator = new FormValidator()
					.registerField(self.QUERY_ID, query, errorBox)
					.attachOnSend(function() {
							eWolf.wolfpacks.createWolfpacks([query.val()], null);			
							diag.dialog( "close" );
						})
					.addValidator(self.QUERY_ID, VALIDATOR_IS_NOT_EMPTY
							, " * Please enter a wolfpack name")
					.addValidator(self.QUERY_ID, function(field) {
							return $.inArray(field.val(),eWolf.wolfpacks.wolfpacksArray) == -1;
						}, " * Wolfpack with that name already exist");
		
		diag.dialog({
			resizable: true,
			modal: true,
			width: 550,
			buttons: {
				"Create": formValidator.sendForm,
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});
	
	return li;
};
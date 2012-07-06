/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
var filedrag = function(uploaderArea) {
	
	var filesArray = [];

	var fileselect = $("<input/>").attr({
		"type": "file",
		"id": "fileselect",
		"name": "fileselect[]",
		"multiple": "multiple"
	}).appendTo(uploaderArea);
	
	var filedrag = $("<div/>")
		.attr("id","filedrag")
		.append("or drop files here")
		.appendTo(uploaderArea);
	
	var filelist = $("<ul/>")
		.attr("id","filelist")
		.appendTo(uploaderArea);


	// output information
	function Output(msg) {
		var box = $("<input/>").attr({
			"type": "checkbox"
		});
		

		$("<li/>").attr({
			"class": "filelistItem"
		}).append(box).append(msg).appendTo(filelist);
	}
	
	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}
		
	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}

	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {
		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			filesArray.push(f);
			ParseFile(f);
		}
	}

	// output file information
	function ParseFile(file) {
		Output(
			"<strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes"
		);
	}


	// initialize
	function Init() {
	
		// file select
		fileselect[0].addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag[0].addEventListener("dragover", FileDragHover, false);
			filedrag[0].addEventListener("dragleave", FileDragHover, false);
			filedrag[0].addEventListener("drop", FileSelectHandler, false);
			filedrag[0].style.display = "block";
		}

	}
	
	return {
		getFiles: function() {
			return files;
		}
	};
};
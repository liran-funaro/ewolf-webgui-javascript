(function($) {
	var vidWidth = 280,
		vidHeight = 240,
		UID = 0,
		playerID = "__YouTube_Player__",
		
		obj = '<object '
				+'width="' + vidWidth + '" ' 
				+ 'height="' + vidHeight + '" '
				+ '>'
					+ '<param name="movie" value="http://www.youtube.com/v/[vid]&hl=en&fs=1"></param>'
					+ '<param name="allowFullScreen" value="true"></param>'
					+ '<param name="allowscriptaccess" value="always"></param>'
					+ '<param name="wmode" value="transparent">'
					+ '<embed '
						+ 'id="' + playerID + '[UID]" '
						+ 'src="http://www.youtube.com/v/[vid]&hl=en&fs=1&version=3&enablejsapi=1" '
						+ 'type="application/x-shockwave-flash" '
						+ 'allowscriptaccess="always" '
						+ 'allowfullscreen="true" '
						+ 'wmode="transparent" '
						+ 'width="' + vidWidth + '" ' + 'height="' + vidHeight
					+ '">'
					+ '</embed>' 
				+ '</object> ';
	

	addYouTubeEmbededToThis = function() {
		var that = $(this);
		var links = that.children("a:contains('youtube.com/watch')");

		links.each(function(i, link) {
			var vid = $(link).attr("href").match(/((\?v=)(\w[\w|-]*))/g); // end up with ?v=oHg5SJYRHA0
			that.append("<br>");
			if (vid.length != 0) {
				var ytid = vid[0].replace(/\?v=/, ''); // end up with oHg5SJYRHA0
				var player = obj.replace(/\[vid\]/g, ytid).replace(/\[UID\]/g, UID);
				UID += 1;
				that.append(player);
			}
		});

	};

	$.fn.addYouTubeEmbeded = function() {
		return this.each(addYouTubeEmbededToThis);
	};
	
	$.fn.stopAllYouTubePlayers = function() {
		var players = this.find("embed[id^="+playerID+"]");
		if(players && players.length > 0) {
			players.each(function(i, p) {
				p.stopVideo();
			});			
		}
	};
})(jQuery);

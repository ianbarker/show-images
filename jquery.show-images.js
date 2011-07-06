/**
 * shows unique images on reddit pages
 * 
 * CONFIG:
 * 
 * change the value of imageWidth if you want the images to display larger or smaller
 * 
 * USAGE:
 * 
 * 1. copy the code below into clipboard (cmd+c or ctrl+c)
 * 2. add a bookmark to your browser
 * 3. edit the bookmarks url and delete what's in there
 * 4. type in 'javascript: ' (without the quotes)
 * 5. paste in the code (cmd+v or ctrl+v)
 * 6. go to reddit... find a page with images you want to view and click on the bookmark
 * 
 */

var loaded = [];
var imageWidth = '400px';
var apiKey = '3c5ee387435906f7b1fd1534732b8e7f';
var flickrUrl = 'http://api.flickr.com/services/rest/';
$('.content').find('a').each(function() {
	var $this = $(this);
	var href = $this.attr('href');
	if ($this.hasClass('title')) {
		if ($.inArray(loaded, href) < 0) {
			loaded.push(href);
			if (href.indexOf('imgur') >= 0 || href.indexOf('jpeg') >= 0 || href.indexOf('jpg') >= 0 || href.indexOf('png') >= 0) {
				if (href.indexOf('imgur') >= 0 && href.indexOf('jpg') == -1)
					href += '.jpg';
				var img = $('<img />').attr('src', href).css({
					width : imageWidth,
					margin : '8px 0 8px 74px'
				});
				$(this).closest('div.thing').after(img);
			} else {
				if ( href.indexOf('flickr') >= 0 ) {
					var photoId = href.match(/([0-9]+)/)[0];
					$.getJSON(flickrUrl,{
						method: 'flickr.photos.getSizes',
						api_key: apiKey,
						photo_id: photoId,
						format: 'json',
						nojsoncallback: 1
					},function(data) {
						if ( data.stat == 'ok') {
							href = data.sizes.size[3].source;
							var img = $('<img />').attr('src', href).css({
								width : imageWidth,
								margin : '8px 0 8px 74px'
							});
							$this.closest('div.thing').after(img);
						}
					});
				}
			}
		}
	}
});
$('div.usertext-body').find('a').each( function() { 
	var href = $(this).attr('href');
	if ($.inArray(loaded, href) < 0) {
		loaded.push(href);
		if (href.indexOf('imgur') >= 0 || href.indexOf('jpeg') >= 0 || href.indexOf('jpg') >= 0 || href.indexOf('png') >= 0) {
			if (href.indexOf('imgur') >= 0 && href.indexOf('jpg') == -1)
				href += '.jpg';
			var img = $('<img />').attr('src', href).css({
				width : imageWidth,
				display: 'inline'
			});
			$(this).after(img);
		} else {
			if ( href.indexOf('flickr') >= 0 ) {
				var photoId = href.match(/([0-9]+)/)[0];
				$.getJSON(flickrUrl,{
					method: 'flickr.photos.getSizes',
					api_key: apiKey,
					photo_id: photoId,
					format: 'json',
					nojsoncallback: 1
				},function(data) {
					if ( data.stat == 'ok') {
						href = data.sizes.size[3].source;
						var img = $('<img />').attr('src', href).css({
							width : imageWidth,
							display: 'inline'
						});
						$this.closest('div.thing').after(img);
					}
				});
			}
		}
	}
});

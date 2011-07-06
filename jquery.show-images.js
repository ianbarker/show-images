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
$('.content').find('a').each(function() {
	var href = $(this).attr('href');
	if ($(this).hasClass('title')) {
		if (jQuery.inArray(loaded, href) < 0) {
			loaded.push(href);
			if (href.indexOf('imgur') >= 0 || href.indexOf('jpeg') >= 0 || href.indexOf('jpg') >= 0 || href.indexOf('png') >= 0) {
				if (href.indexOf('imgur') >= 0 && href.indexOf('jpg') == -1)
					href += '.jpg';
				var img = $('<img />').attr('src', href).css({
					width : imageWidth,
					margin : '8px 0 8px 74px'
				});
				$(this).closest('div.thing').after(img);
			}
		}
	}
	
});
$('div.usertext-body').find('a').each( function() { 
	var href = $(this).attr('href');
	if (jQuery.inArray(loaded, href) < 0) {
		loaded.push(href);
		if (href.indexOf('imgur') >= 0 || href.indexOf('jpeg') >= 0 || href.indexOf('jpg') >= 0 || href.indexOf('png') >= 0) {
			if (href.indexOf('imgur') >= 0 && href.indexOf('jpg') == -1)
				href += '.jpg';
			var img = $('<img />').attr('src', href).css({
				width : imageWidth,
				display: 'inline'
			});
			$(this).after(img);
		}
	}
});
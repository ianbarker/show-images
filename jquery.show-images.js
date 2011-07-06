/**
 * shows unique images on reddit pages
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
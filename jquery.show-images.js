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
 * 4. type in 'javascript:' (without the quotes)
 * 5. paste in the code (cmd+v or ctrl+v)
 * 6. go to reddit... find a page with images you want to view and click on the bookmark
 *
 * @todo fix issue with flickr image ( calling .css() on a non-object )
 *
 */
(function ( $ ) {

    'use strict';

    var imageWidth = 500;

    var loaded = [];
    var ajaxQueue = $({});

    var apiKey = '3c5ee387435906f7b1fd1534732b8e7f';
    var flickrUrl = 'http://api.flickr.com/services/rest/';

    var imgurUrl = 'https://api.imgur.com/3/';
    var clientId = '3d698d807b4e883';


    $.ajaxQueue = function ( ajaxOpts ) {
        // Hold the original complete function.
        var oldComplete = ajaxOpts.complete;

        // Queue our ajax request.
        ajaxQueue.queue(function ( next ) {
            // Create a complete callback to fire the next event in the queue.
            ajaxOpts.complete = function () {
                // Fire the original complete if it was there.
                if ( oldComplete ) {
                    oldComplete.apply(this, arguments);
                }
                // Run the next query in the queue.
                next();
            };

            // Run the query.
            $.ajax(ajaxOpts);
        });
    };


    var getFlickrImage = function ( href, callback ) {

        var matches = href.match(/\/([0-9]+)\//);
        var photoId = matches[1];

        if ( typeof photoId !== 'undefined' ) {
            $.ajaxQueue({
                url: flickrUrl,
                crossDomain: true,
                data: {
                    method: 'flickr.photos.getSizes',
                    api_key: apiKey,
                    photo_id: photoId,
                    format: 'json',
                    nojsoncallback: 1
                },
                success: function ( data ) {
                    if ( data.stat == 'ok' ) {
                        callback(data.sizes.size[7].source);
                    } else {
                        console.error('ERROR: Failed to get flickr image from (' + href + ') ' + photoId);
                    }
                },
                error: function () {
                    console.error('ERROR: Failed to get flickr image from (' + href + ') ' + photoId);
                }
            });
        }
    };

    var getImgurImage = function ( href, callback ) {

        var matches = href.match(/imgur.com\/(.*?\/)?(.*?)(#.*)?$/);
        var path = null;

        if ( typeof matches[1] === 'undefined' ) {

            path = 'image/' + matches[2];

            urlExists('http://i.imgur.com/' + matches[2] + '.jpg', function ( result ) {

                if ( result ) {

                    // no need to use the api
                    callback({success: true, data: { link: 'http://i.imgur.com/' + matches[2] + '.jpg'}});

                } else {
                    $.ajaxQueue({
                        url: imgurUrl + path,
                        crossDomain: true,
                        headers: {
                            Authorization: 'Client-ID ' + clientId
                        },
                        success: $.proxy(callback, this)
                    });
                }
            });

        } else {
            if ( matches[1] == 'a/' ) {
                path = 'album/' + matches[2] + '/images';
            }
            if ( matches[1] == 'gallery/' ) {
                path = 'gallery/' + matches[2] + '/images';
            }

            $.ajaxQueue({
                url: imgurUrl + path,
                crossDomain: true,
                headers: {
                    Authorization: 'Client-ID ' + clientId
                },
                success: $.proxy(callback, this)
            });

        }

    };


    var urlExists = function ( url, callback ) {

        //console.log('urlExists: ' + url);

        $.ajaxQueue({
            type: 'HEAD',
            url: url,
            crossDomain: true,
            success: $.proxy(callback, this, true),
            error: $.proxy(callback, this, false)
        });

    };

    var getImage = function ( $this, inComment ) {

        var href = $this.attr('href');
        if ( typeof href === 'string' ) {
            var cssOptions = ( inComment === true ) ? { width: imageWidth, display: 'inline-block' } : {width: imageWidth, margin: '8px 0 8px 74px'};

            if ( $.inArray(href, loaded) === -1 ) {

                loaded.push(href);

                if ( href.indexOf('/domain/') === -1 ) {

                    if ( href.indexOf('jpeg') >= 0 || href.indexOf('jpg') >= 0 || href.indexOf('png') >= 0 ) {

                        urlExists(href, function ( result ) {
                            if ( result ) {
                                showImage($this, href, href, cssOptions);
                            }
                        });

                    } else if ( href.indexOf('imgur') >= 0 ) {

                        // imgur non direct link
                        getImgurImage(href, function ( result ) {

                            if ( result.success === true ) {

                                if ( Object.prototype.toString.call(result.data) == '[object Array]' && result.data.length > 1 ) {

                                    $.each(result.data, function ( n, image ) {

                                        var src = image.link.replace('.jpg', 'b.jpg');

                                        showImage($this, href, src, {
                                            display: 'inline-block',
                                            width: 160
                                        });

                                    });

                                } else {

                                    var src = result.data.link.replace('.jpg', 'l.jpg');

                                    showImage($this, href, src, cssOptions);
                                }

                                $this.closest('div.thing').find('.expando-button').remove();

                            }

                        });

                    } else if ( href.indexOf('flickr') >= 0 ) {

                        getFlickrImage(href, function ( result ) {
                            showImage($this, href, result, cssOptions);
                        });

                    }

                }

            }
        }

    };

    var showImage = function ( $this, href, imageUrl, cssOptions ) {

        var img = $('<a>', { href: href }).append($('<img>', { src: imageUrl }).css(cssOptions));
        $this.closest('div.thing').append(img);

    }


    $('.content').find('a').each(function () {
        getImage($(this), false);
    });

    $('div.usertext-body').find('a').each(function () {
        getImage($(this), true);
    });

})
    (jQuery);
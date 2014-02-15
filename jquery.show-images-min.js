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
 */(function(e){"use strict";var t=500,n=[],r=e({}),i="3c5ee387435906f7b1fd1534732b8e7f",s="http://api.flickr.com/services/rest/",o="https://api.imgur.com/3/",u="3d698d807b4e883";e.ajaxQueue=function(t){var n=t.complete;r.queue(function(r){t.complete=function(){n&&n.apply(this,arguments);r()};e.ajax(t)})};var a=function(t,n){var r=t.match(/\/([0-9]+)\//),o=r[1];typeof o!="undefined"&&e.ajaxQueue({url:s,crossDomain:!0,data:{method:"flickr.photos.getSizes",api_key:i,photo_id:o,format:"json",nojsoncallback:1},success:function(e){e.stat=="ok"?n(e.sizes.size[7].source):console.error("ERROR: Failed to get flickr image from ("+t+") "+o)},error:function(){console.error("ERROR: Failed to get flickr image from ("+t+") "+o)}})},f=function(t,n){var r=t.match(/imgur.com\/(.*?\/)?(.*?)(#.*)?$/),i=null;if(typeof r[1]=="undefined"){i="image/"+r[2];l("http://i.imgur.com/"+r[2]+".jpg",function(t){t?n({success:!0,data:{link:"http://i.imgur.com/"+r[2]+".jpg"}}):e.ajaxQueue({url:o+i,crossDomain:!0,headers:{Authorization:"Client-ID "+u},success:e.proxy(n,this)})})}else{r[1]=="a/"&&(i="album/"+r[2]+"/images");r[1]=="gallery/"&&(i="gallery/"+r[2]+"/images");e.ajaxQueue({url:o+i,crossDomain:!0,headers:{Authorization:"Client-ID "+u},success:e.proxy(n,this)})}},l=function(t,n){e.ajaxQueue({type:"HEAD",url:t,crossDomain:!0,success:e.proxy(n,this,!0),error:e.proxy(n,this,!1)})},c=function(r,i){var s=r.attr("href");if(typeof s=="string"){var o=i===!0?{width:t,display:"inline-block"}:{width:t,margin:"8px 0 8px 74px"};if(e.inArray(s,n)===-1){n.push(s);s.indexOf("/domain/")===-1&&(s.indexOf("jpeg")>=0||s.indexOf("jpg")>=0||s.indexOf("png")>=0?l(s,function(e){e&&h(r,s,s,o)}):s.indexOf("imgur")>=0?f(s,function(t){if(t.success===!0){if(Object.prototype.toString.call(t.data)=="[object Array]"&&t.data.length>1)e.each(t.data,function(e,t){var n=t.link.replace(".jpg","b.jpg");h(r,s,n,{display:"inline-block",width:160})});else{var n=t.data.link.replace(".jpg","l.jpg");h(r,s,n,o)}r.closest("div.thing").find(".expando-button").remove()}}):s.indexOf("flickr")>=0&&a(s,function(e){h(r,s,e,o)}))}}},h=function(t,n,r,i){var s=e("<a>",{href:n}).append(e("<img>",{src:r}).css(i));t.closest("div.thing").append(s)};e(".content").find("a").each(function(){c(e(this),!1)});e("div.usertext-body").find("a").each(function(){c(e(this),!0)})})(jQuery);
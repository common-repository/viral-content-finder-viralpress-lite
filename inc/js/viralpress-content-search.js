var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/** Init **/
var Search = function() {
    this.config = app_config;
    this.ui = new Ui();
    this.app = new App();
    //init
    this.init();
    this.posts = [];
    this.posts_limit = 10;
    this.posts_per_page = 10;
};

Search.prototype.init = function() {
    this.initForms();
};

/** Show Pages **/
Search.prototype.showPages = function(url) { 
    var $this = this;
    jQuery('#pleaseWaitDialog').modal('show');
    FB.api(url, function(response) {
        jQuery($this.ui.elements.search_form).find('button[type=submit]').attr('disabled', false);
        jQuery("body").css("cursor", "default");
        if (response.error === undefined) {
            $this.ui.showValidationErrors({});
            if(response.data != 0) {
                var pages = response.data;
                var results = jQuery($this.ui.elements.results_table).find('tbody');
                results.html('');
                for (i in pages) {
                    FB.api('/' + pages[i].id + '/?fields=likes,picture,about,name', function(response) {
                        jQuery("body").css("cursor", "default");
                        if (response && !response.error) {
                            if (response.about) {
                                results.append('<tr> \
                                    <td> \
                                        <img src="' + response.picture.data.url + '" alt="" style="width:auto;height:auto;max-width:180px;" /> \
                                    </td> \
                                    <td> \
                                        <h4>' + response.name + '</h4> \
                                        <p>' + response.about + '</p> \
                                        <span class="label label-info">' + response.likes + '</span> Likes \
                                    </td> \
                                    <td style="width:100px;"> \
                                        <a href="#" class="btn btn-success show_recent_posts" data-id="' + response.id + '"><span class="dashicons dashicons-list-view"></span> Explore</a> \
                                    </td> \
                                </tr>');
                            }
                            $this.initRecentPosts();
                        }
                    });
                }
                // Pagination           
                if (response.paging != undefined) {
                    if (response.paging.next != undefined) {
                        jQuery('a#pages_pagination_next').attr('href', response.paging.next).css('display', 'block');
                    } else {
                        jQuery('a#pages_pagination_next').attr('href', '#').css('display', 'none');
                    }
                    if (response.paging.previous != undefined) {
                        jQuery('a#pages_pagination_previous').attr('href', response.paging.previous).css('display', 'block');
                    } else {
                        jQuery('a#pages_pagination_previous').attr('href', '#').css('display', 'none');
                    }
                }
            } else {
                jQuery($this.ui.elements.results_table+' tbody').html('<tr><td class="blankdatas" colspan="3"><span>'+viralpress_lite_search.no_page+'</span></td></tr>');
                jQuery('a#pages_pagination_next').attr('href', '#').css('display', 'none');
                jQuery('a#pages_pagination_previous').attr('href', '#').css('display', 'none');
            }
            jQuery($this.ui.elements.posts_table).hide();
            jQuery($this.ui.elements.results_table).show();
        } else {
            var errors = {};
            errors.search_term = response.error.message.toString();
            $this.ui.showValidationErrors(errors);
        }
        jQuery('#pleaseWaitDialog').modal('hide');
    });
};

/** Init Forms **/
Search.prototype.initForms = function() {
    var $this = this;
    jQuery($this.ui.elements.search_form).unbind('submit').on('submit', function(e) { 
        e.preventDefault();
        jQuery($this.ui.elements.search_form).find('button[type=submit]').attr('disabled', true);
        jQuery("body").css("cursor", "progress");
        jQuery('#records_number').html('');
        var search_term = jQuery(this).find('input[name=search_term]').val().toString();
	    $this.showPages('/search?q=' + search_term + '&type=page');
    });
    jQuery('a.search_paging').unbind('click').on('click', function(e) {
        e.preventDefault();
        var url = jQuery(this).attr('href');
        $this.showPages(url);
    });
};
Search.prototype.showPosts = function(posts) {
    var $this = this;
    posts.sort(function(a, b){
        var a_l, b_l;
        a_l = a.likes != undefined ? a.likes.summary.total_count : 0;
        b_l = b.likes != undefined ? b.likes.summary.total_count : 0;
        return b_l-a_l;
    });
    var results_video = jQuery($this.ui.elements.recent_videoresults_table).find('tbody');
    var results_images = jQuery($this.ui.elements.recent_imageresults_table).find('tbody');
    results_video.html('');
    results_images.html('');
    var image_num = 0;
    var video_num = 0;
    
    for (i in posts) {
        var shares = posts[i].shares != undefined ? '<span class="label label-primary">' + posts[i].shares.count + '</span> Shares' : '';
        var picture = posts[i].picture != undefined ? '<img src="' + posts[i].picture + '" alt="" style="width:auto;height:auto++;max-width:180px;">' : '';
        var date = new Date(posts[i].created_time);
        var created_time = date.getTime();
        var hrdate = date.toDateString();
        var jQueryresults;
        var type = 'image';

        if (posts[i].attachments != undefined) {
	       if (posts[i].attachments.data[0].type !== "photo" && (posts[i].source)) {
                jQueryresults = results_video;
                var download = '<a class="btn btn-default" href="' + posts[i].source + '" target="_blank" download="' + posts[i].source + '"  title="Download"><span class="dashicons dashicons-download"></span></a>';
                type = 'video';
            } else {
                jQueryresults = results_images;
                if ((posts[i].attachments.data) && (posts[i].attachments.data[0].media)) {
                    var download = '<a  class="btn btn-default" href="' + posts[i].attachments.data[0].media.image.src + '" target="_blank" download="' + posts[i].attachments.data[0].media.image.src + '" title="Download"><span class="dashicons dashicons-download"></span></a>';
                } else {               
                    var download = '';
                }
            }
            var likes = posts[i].likes != undefined ? posts[i].likes.summary.total_count : '0'
            var message = posts[i].message != undefined ? posts[i].message : '';  
            var el_id = ''
            if (type == 'image') { el_id = 'el_' + type + '_' + image_num; image_num++; } 
            else { el_id = 'el_' + type + '_' + video_num; video_num++; }

            jQuery("#results").hide(); jQuery("#posts").show();
            jQueryresults.append('<tr data-likes="' + likes + '" data-created-time="' + created_time + '" id="' + el_id +'" class="el_'+ type +'"> \
                <td> \
                    ' + picture + ' \
                </td> \
                <td> \
                    <p>' + message + '</p> \
                    <div style="font-size: 12px;"> \
                        <span class="label label-info">' + likes + '</span> Likes \
                        ' + shares + ' | \
                        <strong>Created</strong>: ' + hrdate + ' \
                        ' +  ' \
                    </div> \
                </td> \
                <td style="width: 170px;"> \
                    <a target="_blank" href="https://www.facebook.com/' + posts[i].id + '" class="btn btn-default" title="View On Facebook"><span class="dashicons dashicons-visibility"></span> </a> \
                    ' + download + ' \
                </td> \
            </tr>');
        }
    }
    jQuery('#posts_video, #posts_images').find('tbody > tr').attr('data-hidden', 'false');
    var videosdatastrue = results_video.html();
    var imagesdatastrue = results_images.html();
    if(videosdatastrue==='' || videosdatastrue==='undefined') {
        jQuery("#posts_video tbody").html('<tr><td class="blankdatas" colspan="3"><span>'+viralpress_lite_search.no_videos+'</span></td></tr>');
    }
    if(imagesdatastrue ==='' || imagesdatastrue==='undefined') {
        jQuery("#posts_images tbody").html('<tr><td class="blankdatas" colspan="3"><span>'+viralpress_lite_search.no_images+'</span></td></tr>');
    }
    $this.displayPage(1, 'image');
    $this.displayPage(1, 'video');
    jQuery($this.ui.elements.results_table).hide();
    jQuery($this.ui.elements.posts_table).show();
};

Search.prototype.displayPage = function(num, type){
     var $this = this;
     var start_element = ((num-1) * 10)

     jQuery('.el_'+ type).hide();

     if (start_element ==0) {
         jQuery('.el_'+ type +'[data-hidden="false"]:lt( ' + 10 +')').show();
     } else {
         jQuery('.el_'+ type +'[data-hidden="false"]:gt(' + (start_element-1) + '):lt( ' + 10 +')').show();
     }
}

Search.prototype.getPosts = function(url){
    var $this = this;
    jQuery('#pleaseWaitDialog').modal('show');
    FB.api(url, function(response) {
        if (response && !response.error) {
            var p = response.data;
            for(i in p){
                $this.posts.push(p[i]);
                jQuery('#records_number').html($this.posts.length);
            }
            if(response.paging === undefined) {
                jQuery("body").css("cursor", "default");
                jQuery('.show_recent_posts').attr('disabled', false);
                jQuery('#pleaseWaitDialog').modal('hide');
                $this.showPosts($this.posts);
            } else {
                if(response.paging.next != undefined && $this.posts.length < 20){
                    $this.getPosts(response.paging.next);
                } else {
                    jQuery("body").css("cursor", "default");
                    jQuery('.show_recent_posts').attr('disabled', false);
                    jQuery('#pleaseWaitDialog').modal('hide');
                    $this.showPosts($this.posts);
                }
            }
        }
    });
};
Search.prototype.initRecentPosts = function() {
   var $this = this;
    while ($this.posts.length > 0) {
        $this.posts.pop();
    }
    jQuery('.show_recent_posts').unbind('click').on('click', function(e) {
        jQuery('.show_recent_posts').attr('disabled', true);
        e.preventDefault();
        jQuery("body").css("cursor", "progress");
        var page_id = jQuery(this).attr('data-id');
        $this.getPosts('/' + page_id + '/feed?limit=20&fields=link,message,shares,picture,created_time,source,attachments{type,url,media},likes.summary(true)');
    });
    jQuery('#back').unbind('click').on('click', function(e) {
        e.preventDefault();
        $this.posts = [];
        jQuery($this.ui.elements.posts_table).hide();
        jQuery($this.ui.elements.results_table).show();
    });
}
// App start
var App = function() { this.config = app_config; this.init(); };
App.prototype.init = function() { return null; };
// App end

// Auth start
var Auth = function() { this.config = app_config; this.ui = new Ui(); this.app = new App(); this.init(); };
Auth.prototype.init = function() { 
    jQuery.this = this; jQuery.this.initFB();
    // init login buttons, forms, etc.
    jQuery(jQuery.this.ui.elements.login_btn).unbind('click').on('click', function(e) {
        jQuery(jQuery.this.ui.elements.fblogin_btn).hide();
        jQuery(jQuery.this.ui.elements.login_btn).hide();
        jQuery(jQuery.this.ui.elements.registration_form).hide();
        jQuery(jQuery.this.ui.elements.login_form).show();
    });
    jQuery(jQuery.this.ui.elements.fblogin_btn).unbind('click').on('click', function(e) {
        FB.login(function(response) { 
            if (response.authResponse) { 
                FB.api('/me?fields=id,email,name,first_name,last_name', function(response) {
                    jQuery(jQuery.this.ui.elements.fblogin_btn).hide();
                    jQuery(jQuery.this.ui.elements.login_form).hide();
                    jQuery('#loginModal').modal('hide'); jQuery("#login_status").html(viralpress_lite.welcome+' '+response.name);
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: jQuery.this.config.fb_scope });
    });
    jQuery(jQuery.this.ui.elements.logout_btn).unbind('click').on('click', function(e) {
        e.preventDefault();
        jQuery.this.app._ajax('auth/logout', {}, function(r) { jQuery.this.ui.logOutSuccess(); }, function(r) {}); 
    });
};
Auth.prototype.initFB = function() { 
    jQuery.this = this;
    // load FB JS SDK
    window.fbAsyncInit = function() {
        // init the FB JS SDK
        FB.init({
            appId: jQuery.this.config.fb_app_id, // App ID from the app dashboard
            status: true, // Check Facebook Login status
            xfbml: true // Look for social plugins on the page
        });
       FB.getLoginStatus(function(response){
        if(response.status=="connected") {
            jQuery('#loginModal').modal('hide'); jQuery("#login_status").html(viralpress_lite.success);
         } else {
            jQuery('#loginModal').modal('show'); jQuery("#login_status").html(viralpress_lite.login+" <a onclick =\"javascript:jQuery('#loginModal').modal('show');\"  >"+viralpress_lite.here+"</a>");
         }
       });
    };
    // Load the SDK asynchronously
    (function() {
        // If we've already installed the SDK, we're done
        if (document.getElementById('facebook-jssdk')) { return; }
        // Get the first script element, which we'll use to find the parent node
        var firstScriptElement = document.getElementsByTagName('script')[0];
        // Create a new script element and set its id
        var facebookJS = document.createElement('script'); facebookJS.id = 'facebook-jssdk';
        // Set the new script's source to the source of the Facebook JS SDK
        facebookJS.src = '//connect.facebook.net/en_US/all.js';
        // Insert the Facebook JS SDK into the DOM
        firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());
};
// Auth end

// UI start
var Ui = function() {
    this.config = app_config;
    this.elements = {};
    // general
    this.elements.validation_error = '.validation-error';
    this.elements.delayed_action = '#delayed_action';
    // auth
    this.elements.fblogin_btn = '#fblogin';
    this.elements.login_btn = '#login';
    this.elements.login_form = 'form#login_form';
    this.elements.registration_form = 'form#registration_form';
    this.elements.login_modal = '#loginModal';
    this.elements.logout_btn = '#logout';
    // settings
    this.elements.settings_general_form = 'form#settings_general_form';
    this.elements.settings_address_form = 'form#settings_address_form';
    // search 
    this.elements.search_form = "form#search_form";
    this.elements.filters_form = "form#filters_form";
    this.elements.results_table = "#results";
    this.elements.recent_videoresults_table = "#posts_video";
    this.elements.recent_imageresults_table = "#posts_images";
    this.elements.recent_post_tabs = "#recent_post_tabs";
    this.elements.posts_table = "#posts";
    this.elements.fb_share_btn = ".fb_share";
    this.elements.viral_sorting = "#viral_sort";
    this.elements.viral_recentpost_sorting = "#viral_recentpost_sort";
    this.app = new App();
    //init
    this.init();
};
Ui.prototype.init = function() {
    var show_login_popup = jQuery('input[name=show_login_popup]').val();
    if(show_login_popup === 'true'){
        jQuery('#loginModal').modal('show');
    }
};
/*----------  delayed actions  ----------*/
Ui.prototype.setDelayedAction = function(delayed_action) {
    jQuery(this.elements.delayed_action).html(delayed_action);
};
Ui.prototype.resetDelayedAction = function() {
    jQuery(this.elements.delayed_action).html('');
};
Ui.prototype.execDelayedAction = function() {
    var delayed_action = jQuery(this.elements.delayed_action).html();
    this.resetDelayedAction();
    eval(delayed_action);
};
/*----------  login/logout Ui actions  ----------*/
Ui.prototype.logInSuccess = function() {
    jQuery(this.elements.login_modal).modal('hide');
    this.navbarToggle();
    this.execDelayedAction();
    window.location.href = this.config.base_url + 'search';
};
Ui.prototype.logOutSuccess = function() {
    this.navbarToggle();
    this.execDelayedAction();
};
/*----------  general Ui actions  ----------*/
Ui.prototype.showValidationErrors = function(errors) {
    jQuery(this.elements.validation_error).remove();
    for (var key in errors) {
        var elem = '[name=' + key + ']';
        var error = errors[key];
        var parent = jQuery(elem).parent();
        if (parent.hasClass('input-group')) {
            parent.after('<span class="validation-error">' + error + '</span>');
        } else {
            jQuery(elem).after('<span class="validation-error">' + error + '</span>');
        }
    }
};

// Configuration
var app_config = {}; app_config.fb_app_id = ""; 
app_config.fb_scope = "email,publish_actions"; 
var data = {'action': 'getfacebookdetails','get': 'true'}

jQuery.ajax({
	url:viralpress_lite.ajax_url,
    type:'POST', 
    async: false, 
    dataType:'json',
    data:data, 
    success:function(response){
        console.clear();
        if(response) {
            app_config.fb_app_id = response.app_id;
        } 
    }
});
console.clear();
var auth = new Auth(); 
var ui = new Ui();
var search = new Search();
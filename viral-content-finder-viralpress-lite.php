<?php
/*
* Plugin Name: ViralPress Lite
* Plugin URI: https://indigothemes.com/products/viralpress-pro-viral-content-finder-wordpress-plugin/
* Description: ViralPress Lite is the most powerful and unique WordPress plugin to find and analyze viral content from Facebook for any business/niche.
* Version: 1.2.5
* Author: IndigoThemes
* Author URI: https://indigothemes.com/
* Text Domain: viralpress-lite
* Domain Path: /languages
* License: GPLv3 or later
* License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/

Class ViralPress_Lite {

	// Register INIT ViralPress-Lite
	public function __construct() {
		//print_r(get_plugin_data(plugins_url('viralpress-lite.php')));
		add_action( 'admin_menu', array(&$this, 'viralpress_menu') );
		add_action( 'admin_enqueue_scripts', array(&$this, 'viralpress_assets') );
		add_action( 'init', array(&$this, 'viralpress_text_domain') );
		add_action( 'admin_init', array(&$this, 'update_viralpress_settings' ) );
	}

	// Text Domain
	public function viralpress_text_domain() {
		load_plugin_textdomain( 'viralpress-lite', false, basename( dirname( __FILE__ ) ) . '/languages' );
	}

	// Init & Call Js Files In Header.
	public function viralpress_assets() {
		wp_enqueue_style( 'bootstrap-min-css', plugins_url('inc/css/bootstrap.min.css', __FILE__),array(), '3.2.0' );
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'bootstrap-min-js', plugins_url('inc/js/bootstrap.min.js', __FILE__),array(), '3.1.1' );
		wp_enqueue_style( 'viralpress-lite-css', plugins_url('inc/css/viralpress-lite.css', __FILE__), array() );
	}

	// ViralPress-Lite Menus.
	public function viralpress_menu() {
		add_menu_page('ViralPress Lite', 'ViralPress Lite', 'manage_options', 'viralpress-lite', array(&$this,'gettting_started'), '');
		add_submenu_page('viralpress-lite', 'Getting Started', 'Getting Started', 'manage_options', 'viralpress-lite' );
		add_submenu_page( 'viralpress-lite', 'ViralPress Settings', 'ViralPress Settings', 'manage_options', 'viralpress-lite-settings', array(&$this, 'viralpress_facebook_settings') );
		add_submenu_page( 'viralpress-lite', 'Viral Content Finder', 'Viral Content Finder', 'manage_options', 'viralcontent-finder', array(&$this, 'viralpress_options_callback') );
	}

	// Get Startting Help Line
	public function gettting_started() {
		include("viralpress-getting-started.php");
	}

	// ViralPress-Lite Options.
	public function viralpress_facebook_settings() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( _e('You do not have sufficient permissions to access this page.', 'viralpress-lite') );

		}
		echo '<div class="wrap">';?>
		<h2><?php _e('Facebook Settings', 'viralpress-lite'); ?></h2>
		  <form method="post" action="options.php">
		    <?php settings_fields( 'viralpress-settings' ); ?>
		    <?php do_settings_sections( 'viralpress-settings' ); ?>
		    <table class="form-table">      
		      <tr valign="top">
		      <th scope="row"><label for="app_id"><?php _e('Facebook Application ID', 'viralpress-lite'); ?>:</label></th>
		      <td><input type="text" name="app_id" id="app_id" value="<?php echo get_option( 'app_id' ); ?>"/></td>
		      </tr>
		    </table>
		    <?php submit_button(); ?>
		  </form>
		<?php echo "</div>"; 
	}

	// ViralPress-Lite CallBack Option.
	public function viralpress_options_callback() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( _e('You do not have sufficient permissions to access this page.', 'viralpress-lite') );
		}
		include("viral-content-finder.php");
		wp_enqueue_script( 'viralpress-search-script', plugins_url('inc/js/viralpress-content-search.js', __FILE__),array() );
		$viralpress_lite_translation = array('no_videos'=> __('It seems no videos were posted on this Facebook page.', 'viralpress-lite'), 'no_images'=> __('It seems no images were posted on this Facebook page.', 'viralpress-lite'), 'no_page'=> __('No Facebook page was found related to the keyword you entered.', 'viralpress-lite') );
		wp_localize_script( 'viralpress-search-script', 'viralpress_lite_search', $viralpress_lite_translation);
		wp_enqueue_script( 'viralpress-search-all', plugins_url('inc/js/viralpress-lite.js', __FILE__),array() );
		wp_localize_script( 'viralpress-search-all', 'viralpress_lite', array( 'welcome'=>__('Welcome', 'viralpress-lite'), 'success'=>__('You are successfully logged in from Facebook.', 'viralpress-lite'), 'login'=>__('Please login to Facebook by clicking','viralpress-lite'), 'here'=>__('here', 'viralpress-lite'), 'ajax_url'=>admin_url( 'admin-ajax.php' ) ) );
	}	

	// Update ViralPress-Lite Settings.
	public function update_viralpress_settings() {
	  register_setting( 'viralpress-settings', 'app_id' );
	}
	
	// Get Facebook Details.
	public function viralpress_getfacebookdetails() { 
		global $wpdb; 
		if(isset($_POST['get']) && ($_POST['get'])) {
			$data['app_id'] = get_option('app_id');
			echo json_encode($data);
		}
		exit;
	}
}
// Install This Plugin using ViralPress-Lite Class.
$viralpress_lite = new ViralPress_Lite();

// ViralPress-Lite Get Facebook Details.
add_action( 'getfacebookdetails', array( &$viralpress_lite, 'viralpress_getfacebookdetails' ) );
add_action( 'wp_ajax_getfacebookdetails', array( &$viralpress_lite, 'viralpress_getfacebookdetails' ) );
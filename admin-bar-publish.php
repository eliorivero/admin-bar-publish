<?php
/**
 * Plugin Name: Admin Bar Publish
 * Plugin URI: https://startfunction.com/admin-bar-publish
 * Description: Adds a button to the front end admin bar to instantly publish a post.
 * Version: 1.0.1
 * Author: Elio Rivero
 * Author URI: https://startfunction.com
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 * Text Domain: admin-bar-publish
 *
 * @package admin-bar-publish
 */

defined( 'ABSPATH' ) || exit;

define( 'ADMIN_BAR_PUBLISH_VERSION', '1.0.1' );
define( '__ADMIN_BAR_PUBLISH__', __FILE__ );

add_action( 'plugins_loaded', 'admin_bar_publish_load' );

/**
 * Initialize plugin
 *
 * @since 1.0.0
 */
function admin_bar_publish_load() {
	if ( current_user_can( 'edit_others_posts' ) ) {
		load_plugin_textdomain( 'admin-bar-publish', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		// Load endpoints
		require_once 'endpoints.php';
		add_action( 'wp_before_admin_bar_render', 'admin_bar_publish_menu' );
		add_action( 'wp_enqueue_scripts', 'admin_bar_publish_menu_enqueue' );
	}
}

/**
 * Add menu item to Admin Bar
 *
 * @since 1.0.0
 */
function admin_bar_publish_menu() {
	if ( ! is_admin() && ! is_front_page() ) {
		global $wp_admin_bar;
		$post_id = get_queried_object_id();
		$post_status = get_post_status( $post_id );
		if ( in_array( $post_status, array( 'draft', 'publish' ), true ) ) {
			$label = 'draft' === $post_status
				? esc_html__( 'Publish', 'admin-bar-publish' )
				: esc_html__( 'Draft', 'admin-bar-publish' );
			$wp_admin_bar->add_menu( array(
				'id' => 'sfnAdminBarPublishBtn',
				'title' => $label,
				'href' => '#',
				'meta' => array(
					'class' => $post_status,
					'title' => $label
				),
			));
		}
	}
}

/**
 * Enqueue scripts.
 *
 * @since 1.0.0
 */
function admin_bar_publish_menu_enqueue() {
	wp_enqueue_style(
		'admin-bar-publish',
		plugins_url( 'css/admin-bar-publish.css', __FILE__ ),
		array(),
		ADMIN_BAR_PUBLISH_VERSION
	);
	wp_enqueue_script( 
		'admin-bar-publish',
		plugins_url( 'js/admin-bar-publish.js', __FILE__ ),
		array(),
		ADMIN_BAR_PUBLISH_VERSION,
		true
	);
	$post_id = get_queried_object_id();
	// The publish and draft are swapped because the current post status determines the action and thus the label
	wp_add_inline_script(
		'admin-bar-publish',
		'window.sfnAdminBarPublish = {
			restUrl: "' . esc_url_raw( rest_url() ) . '",
			nonce: "' . wp_create_nonce( 'wp_rest' ) . '",
			postId: ' . $post_id . ',
			postStatus: "' . get_post_status( $post_id ) . '",
			httpError: "' . esc_html__( 'HTTP Error', 'admin-bar-publish' ) . ': ",
			working: "' . esc_html__( 'Working…', 'admin-bar-publish' ) . '",
			publish: "' . esc_html__( 'Draft', 'admin-bar-publish' ) . '",
			draft: "' . esc_html__( 'Publish', 'admin-bar-publish' ) . '",
		};'
    );
}
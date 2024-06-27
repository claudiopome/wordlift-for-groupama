<?php
/**
 *
 * @link              https://wordlift.io
 * @since             1.0.0
 * @package           Wordlift_For_Groupama
 *
 * @wordpress-plugin
 * Plugin Name:       WordLift for Groupama
 * Plugin URI:        https://wordlift.io
 * Description:       Companion plugin for Groupama website.
 * Version:           1.0.0
 * Author:            WordLift
 * Author URI:        https://wordlift.io
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wordlift-for-groupama
 * Domain Path:       /languages
 */

define( 'WORDLIFT_FOR_GROUPAMA_VERSION', '1.0.0' );

add_action( 'wp_enqueue_scripts', function () {

	$context_cards_base_url = apply_filters( 'wl_context_cards_base_url', get_rest_url( null, WL_REST_ROUTE_DEFAULT_NAMESPACE . '/jsonld' ) );

	wp_enqueue_style( 'wordlift-for-groupama-style', plugin_dir_url( __FILE__ ) . 'dist/assets/index.css', array(), WORDLIFT_FOR_GROUPAMA_VERSION );
	wp_enqueue_script( 'wordlift-for-groupama-script', plugin_dir_url( __FILE__ ) . 'dist/assets/index.js', array( 'react' ), WORDLIFT_FOR_GROUPAMA_VERSION, true );

	wp_localize_script(
		'wordlift-for-groupama-script',
		'_wlCloudSettings',
		array(
			'selector' => 'a.wl-entity-page-link',
			'url'      => $context_cards_base_url,
		)
	);
} );

add_action( 'init', function () {
	// Disable default Context Cards.
	add_filter( 'wl_context_cards_show', '__return_false' );

} );

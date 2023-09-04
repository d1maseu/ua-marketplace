<?php

/**
 * Trigger this file on Plugin uninstall
 *
 * @package  morkva-ua-marketplace-woo-plugin
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die;
}

// Delete all added by the plugin WordPress options with `mrkv_uamrkpl_` prefix
function mrkv_uamrkpl_delete_wp_options_prefixed( $prefix ) {
    global $wpdb;
    $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '{$prefix}%'" );
}
mrkv_uamrkpl_delete_wp_options_prefixed( 'mrkv_uamrkpl_' );

// Delete the main plugin option
delete_option( 'mrkv_ua_marketplaces' );

// Remove xml-file
$file_pointer = WP_CONTENT_DIR . '/uploads/mrkvuamprozetka.xml';
if ( \file_exists( $file_pointer ) ) {
	\unlink( $file_pointer );
} 
echo 'privet mir';
$arrayNew = ();

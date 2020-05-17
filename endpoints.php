<?php
/**
 * Define endpoint to publish or draft a post.
 *
 * @since 1.0.0
 */

add_action( 'rest_api_init', 'startfunction_admin_bar_publish_endpoint' );

/**
 * Register endpoint to change the post status
 * 
 * @since 1.0.0
 */
function startfunction_admin_bar_publish_endpoint() {
	register_rest_route( 'startfunction/v1', '/admin-bar/publish/', array(
		'methods' => WP_REST_Server::CREATABLE,
		'callback' => 'startfunction_admin_bar_transition',
		'args'     => array(
			'post_id' => array(
				'required' => true,
			),
			'to' => array(
				'required' => true,
			),
		),
	) );
}

/**
 * Publish or draft a post.
 * 
 * @since 1.0.0
 * 
 * @param WP_REST_REQUEST $request
 * 
 * @return WP_REST_RESPONSE $response
 */
function startfunction_admin_bar_transition( WP_REST_Request $request ) {
	$post_id = $request->get_param( 'post_id' );
	$post_status = get_post_status( $post_id );
	// Let's make sure it's only draft or publish to continue
	if ( ! in_array( $post_status, array( 'draft', 'publish' ), true ) ) {
		return rest_ensure_response( array(
			'postStatus' => $post_status,
			'message'    => esc_html__( 'Unsupported post status', 'admin-bar-publish' ),
		) );
	}
	$to = $request->get_param( 'to' );
	// If the current post status is the same than the post status requested by the user
	if ( $to === $post_status ) {
		$response = array(
			'postStatus' => $to,
			'permalink'  => 'publish' === $to
				? get_permalink( $post_id )
				: get_preview_post_link( $post_id ),
			'message'    => 'publish' === $to
				? esc_html__( 'Post was already published', 'admin-bar-publish' )
				: esc_html__( 'Post was already a draft', 'admin-bar-publish' ),
		);
	} else {
		if ( 'publish' === $to ) {
			wp_publish_post( $post_id );
		} else {
			wp_update_post( array(
				'ID'           => $post_id,
				'post_status'  => $to,
			) );
		}
		$new_post_status = get_post_status( $post_id );
		/* Translators: placeholder is a post status */
		$some_wrong = sprintf( esc_html__( 'Something went wrong. Post status is: %s', 'admin-bar-publish' ), $new_post_status );
		if ( 'publish' === $to ) {
			$permalink = get_permalink( $post_id );
			$message   = $to === $new_post_status
				? esc_html__( 'Post successfully published!', 'admin-bar-publish' )
				: $some_wrong;
		} else {
			$permalink = get_preview_post_link( $post_id );
			$message   = $to === $new_post_status
				? esc_html__( 'Post correctly switched to draft', 'admin-bar-publish' )
				: $some_wrong;
		}
		$response = array(
			'postStatus' => $new_post_status,
			'permalink'  => $permalink,
			'message'    => $message,
		);
	}
	return rest_ensure_response( $response );
}

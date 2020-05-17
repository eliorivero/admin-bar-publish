/**
 * Admin Bar Publish for WordPress Admin Bar
 * Created by startfunction.com
 * Follow on Twitter twitter.com/eliorivero 
 */

import './main.scss';

type SFNAdminBarPublishData = {
	restUrl: string,
	nonce: string,
	postId: number,
	postStatus: string,
	httpError: string,
	working: string,
	publish: string,
	draft: string,
};

interface SFNAdminBarPublishResponse {
	postStatus: string,
	permalink: string,
	message: string,
};

declare var sfnAdminBarPublish: SFNAdminBarPublishData;

 /**
  * Check that the admin bar button and the JS variable with data for the REST API request exist.
  * Attach a method to the click event of the admin bar button that manages the request.
  * 
  * @since 1.0.0
  * 
  * @returns {bool} True if method was attached to the event. False if some element didn't exist.
  */
export const adminBarPublishInit = (): boolean => {
	
	const adminBarButton = document.querySelector( '#wp-admin-bar-sfnAdminBarPublishBtn > .ab-item' );

	if ( ! sfnAdminBarPublish || ! [ 'draft', 'publish' ].includes( sfnAdminBarPublish.postStatus ) ) {
		if ( adminBarButton ) {
			adminBarButton.parentNode.removeChild( adminBarButton );
		}
		return false;
	}
	
	if ( ! adminBarButton ) {
		return false;
	}
	
	adminBarButton.addEventListener('click', e => {
		e.preventDefault();
		adminBarButton.textContent = sfnAdminBarPublish.working;
		fetch( sfnAdminBarPublish.restUrl + 'startfunction/v1/admin-bar/publish/', {
			method: 'POST',
			headers: {
				'X-WP-Nonce': sfnAdminBarPublish.nonce,
				'Content-type': 'application/json',
			},
			body: JSON.stringify( {
				'post_id': sfnAdminBarPublish.postId,
				'to': 'draft' === sfnAdminBarPublish.postStatus
					? 'publish'
					: 'draft'
			} ),
		} )
			.then( res => {
				if ( ! res.ok ) {
					alert( sfnAdminBarPublish.httpError + res.status );
					throw new Error( sfnAdminBarPublish.httpError + res.status );
				}
				return res.json();
			} )
			.then( res => {
				adminBarPublishHandleResponse( res, adminBarButton );
			} )
			.catch( err => console.error( err ) );
	});

	return true;
}

/**
 * Display a message, update the admin bar button. Update the URL in browser.
 * If something failed, remove the button.
 *
 * @param {object} res The server response after drafting or publshing a post.
 */
export const adminBarPublishHandleResponse = ( res: SFNAdminBarPublishResponse, adminBarButton: Element ) => {
	alert( res.message );
	if ( [ 'draft', 'publish' ].includes( res.postStatus ) ) {
		adminBarButton.textContent = sfnAdminBarPublish[ res.postStatus ];
		(<Element>adminBarButton.parentNode).classList.add( res.postStatus );
		(<Element>adminBarButton.parentNode).classList.remove( sfnAdminBarPublish.postStatus );
		sfnAdminBarPublish.postStatus = res.postStatus;
	} else {
		adminBarButton.parentNode.removeChild( adminBarButton );
	}
	if ( res.permalink ) {
		history.replaceState( null, '', res.permalink );
	}
	return adminBarButton;
};

document.addEventListener('DOMContentLoaded', adminBarPublishInit);

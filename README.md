# Admin Bar Publish
Set post status to publish or draft from the front end using the WordPress REST API.

This Plugin extends the Admin Bar by adding a button that allows to publish an entry from the front end.
If the entry is already published, the button functionality changes to allow to switch it to a draft.

Publishing the post not only changes the post status from 'draft' to 'publish'. It will run all the actions associated with publishing as if you were doing it in the WP Admin side.

# Installing

Clone this repo to your `wp-content/plugins/` directory.

Run `npm run build`.

Go to `WP Admin > Plugins` and activate it.

# Using

Go to a post that's in preview mode.
You'll see a button to publish it.
Once you click on it, the post will be published.
The button changed now to draft the post.
Click on it and the post will be switched to a draft.

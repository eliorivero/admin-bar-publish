# Admin Bar Publish

![Admin Bar Publish](admin-bar-publish.png)

Set post status to publish or draft from the front end.

This plugin extends the Admin Bar by adding a button that allows to publish an entry from the front end.
If the entry is already published, the button functionality changes to allow to switch it to a draft. It's written with TypeScript with tests in Jest and uses the REST API.

Publishing the post not only changes the post status from 'draft' to 'publish'. It will run all the actions associated with publishing as if you were doing it in the WP Admin side.

Plugin page: https://startfunction.com/admin-bar-publish/

Plugin at WordPress.org https://wordpress.org/plugins/admin-bar-publish/

# Installing

Clone this repo to your `wp-content/plugins/` directory.

Run `npm run build`.

Go to `WP Admin > Plugins` and activate it.

# Using

- Go to a post that's in preview mode.
- You'll see a button to Publish it.
- Once you click on it, the post will be published.
- The button changed now to Draft.
- Click on it and the post will be switched to a draft.

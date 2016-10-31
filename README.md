# watsonwork-sender

[![Build Status](https://travis-ci.org/watsonwork/watsonwork-sender.svg)](https://travis-ci.org/watsonwork/watsonwork-sender)

A Node.js example app that sends a message to [Watson Work]
(https://workspace.ibm.com).

The Watson Work platform provides **spaces** for people to exchange
**messages** in conversations. This sample app shows how to retrieve
information about a space, then send a message to the conversation in
that space. It also demonstrates how to authenticate an application and
obtain the OAuth token needed to make Watson Work API calls.

## Try it out

To try the sample app do the following:

### Register the app

In your Web browser, go to [Watson Work Services - Apps]
(https://workspace.ibm.com/developer/apps), add a new app named
**Sender** and write down its app id and app secret.

### Build the app

Install Node.js 6+.

In a terminal window, do the following:
```sh
# For more verbose output
export DEBUG=watsonwork-*

# Get the code
git clone https://github.com/watsonwork/watsonwork-sender

# Build the app
cd watsonwork-sender
npm run build
```

### Add the app to a space

Leave the terminal window open as you'll need it again soon.

In your Web browser, go to [Watson Workspace](https://workspace.ibm.com),
create a space named **Examples**, then open the **Apps** tab for that space
and add the **Sender** app to it.

### Send a message using the app

You're now ready to use the sample app to send a message!

Back in the terminal window, do the following:
```sh
# Configure the app id and app secret
export SENDER_APP_ID=<the Sender app id>
export SENDER_APP_SECRET=<the Sender app secret>

npm run sender "Examples" "Hello *there*"
```

The Sender app will send "Hello *there*" to the conversation in the
**Examples** space. You should now see a new message in that space.

## Layout

The example source tree is organized as follows:

```sh
README.md     - this README
package.json  - Node.js package definition

src/          - Javascript sources

  app.js      - main app script

  test/       - unit tests
```

## What API does the app use?

The app uses the [Watson Work OAuth API]
(https://workspace.ibm.com/developer/docs) to authenticate and get an
OAuth token.  It then uses the [Watson Work GraphQL API]
(https://workspace.ibm.com/developer/docs) to retrieve a list of spaces.
Finally, it uses the [Watson Work Spaces API]
(https://workspace.ibm.com/developer/docs) to send a message to the
conversation in the selected space.

## How can I contribute?

Pull requests welcome!


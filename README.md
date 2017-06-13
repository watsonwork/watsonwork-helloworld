# watsonwork-helloworld

[![Build Status](https://travis-ci.org/watsonwork/watsonwork-helloworld.svg)](https://travis-ci.org/watsonwork/watsonwork-helloworld)

A Node.js sample app that sends a *Hello World* message to a space in
[IBM Watson Workspace] (https://workspace.ibm.com).

The Watson Work platform provides **spaces** for people to exchange
**messages** in conversations. This sample app shows how to retrieve
information about a space, then send a message to the conversation in
that space. It also demonstrates how to authenticate an application and
obtain the OAuth token needed to make Watson Work API calls.

## Try it out

To try the sample app do the following:

### Registering the app

In your Web browser, go to [Watson Work Services - Apps]
(https://developer.watsonwork.ibm.com/apps), add a new app named
**Hello World** and write down its app id and app secret.

### Building the app

Install Node.js 6+.

In a terminal window, do the following:
```sh
# For more verbose output
export DEBUG=watsonwork-*

# Get the code
git clone https://github.com/watsonwork/watsonwork-helloworld

# Build the app
cd watsonwork-helloworld
npm run build
```

### Adding the app to a space

Leave the terminal window open as you'll need it again soon.

In your Web browser, go to [Watson Workspace](https://workspace.ibm.com),
create a space named **Examples**, then open the **Apps** tab for that space
and add the **Hello World** app to it.

### Sending a message using the app

You're now ready to use the sample app to send a message!

Back in the terminal window, do the following:
```sh
# Configure the app id and app secret
export HELLOWORLD_APP_ID=<the Hello World app id>
export HELLOWORLD_APP_SECRET=<the Hello World app secret>

npm run helloworld "Examples"
```

The Hello World app will send "Hello World! Welcome to **Watson Work**!" to
the conversation in the **Examples** space. You should now see a new message
in that space.

## Project layout

The sample project source tree is organized as follows:

```sh
README.md     - this README
package.json  - Node.js package definition

src/          - Javascript sources

  app.js      - main app script

  test/       - unit tests
```

## What API does the app use?

The app uses the [Watson Work OAuth API]
(https://developer.watsonwork.ibm.com/docs) to authenticate and get an
OAuth token.  It then uses the [Watson Work GraphQL API]
(https://developer.watsonwork.ibm.com/docs) to retrieve a list of spaces.
Finally, it uses the [Watson Work Spaces API]
(https://developer.watsonwork.ibm.com/docs) to send a message to the
conversation in the selected space.

## How can I contribute?

Pull requests welcome!


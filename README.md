watsonwork-sender
===

[![Build Status](https://travis-ci.org/jsdelfino/watsonwork-sender.svg)](https://travis-ci.org/jsdelfino/watsonwork-sender)

A Node.js example app that sends a message to [Watson Work]
(https://workspace.ibm.com).

This program shows how to implement an app that retrieves information
about a Watson Work space and sends a message to it.  It also demonstrates how
to authenticate with Watson Work as an application and obtain the OAuth token
needed to make Watson Work API calls.

Try it out
---

To try the sample app do the following:

Go to [Watson Work Services - Apps](https://workspace.ibm.com/developer/apps)
and on that page add a new app named `Sender`. Write down the app id and
ap secret.

Install Node.js 6+.

In a terminal window, do the following:
```sh
export SENDER_APP_ID=<your Sender app id>
export SENDER_APP_SECRET=<Your Sender app secret>
export DEBUG=watsonwork-sender
git clone https://github.com/jsdelfino/watsonwork
cd watsonwork-sender
npm run build
node lib/app "Examples" "Hello"
```

Leave the terminal window open for now as we'll need it again soon.

Go to [Watson Workspace](https//workspace.ibm.com), create a space named
`Examples`, then navigate to the Apps tab for that space and add the `Sender`
app to it.

You're now ready to use the sample app to send a message to Watson Work.

Back in the terminal window, do the following:
```sh
node lib/app "Examples" "Hello"
```

The Sender app will send `Hello` to the `Examples` space. You should now see
a new message in the `Examples` space in your Web browser.

Layout
---

The example source tree is organized as follows:

```sh
README.md     - this README
package.json  - Node.js package definition

src/          - Javascript sources

  app.js      - main app script, authenticates, finds space and sends a message

  test/       - unit tests

```

What API does the app use?
---

The app uses the [Watson Work OAuth API]
(https://workspace.ibm.com/developer/docs) to authenticate and get an
OAuth token.

It then uses the [Watson Work GraphQL API]
(https://workspace.ibm.com/developer/docs) to retrieve the list of spaces the
app has been added to.

Finally it uses the [Watson Work Spaces API]
(https://workspace.ibm.com/developer/docs) to send a message to the
conversation in the selected space.

How can I contribute?
--

Pull requests welcome!


watsonwork-sender
===

[![Build Status](https://travis-ci.org/jsdelfino/watsonwork-sender.svg)](https://travis-ci.org/jsdelfino/watsonwork-sender)

A Node.js example app that sends a message to [Watson Work]
(https://workspace.ibm.com).

This program shows how to retrieve information about a Watson Work space
and send a text message with a title and simple markdown formatting to
the conversation in that space.  It also demonstrates how to authenticate
as an application and obtain the OAuth token needed to make Watson Work
API calls.

Try it out
---

To try the sample app do the following:

In your Web browser, go to [Watson Work Services - Apps]
(https://workspace.ibm.com/developer/apps) and on that page add a new app
named **Sender**. Write down the app id and app secret for that new app.

Install Node.js 6+.

In a terminal window, do the following:
```sh
# Configure the app id and app secret you just got
export SENDER_APP_ID=<the Sender app id>
export SENDER_APP_SECRET=<the Sender app secret>

# For more verbose output
export DEBUG=watsonwork-sender

# To get the code
git clone https://github.com/jsdelfino/watsonwork

# To build the sample app
cd watsonwork-sender
npm run build
```

Leave the terminal window open for now as we'll need it again soon.

In your Web browser, go to [Watson Workspace](https://workspace.ibm.com),
create a space named **Examples**.

Navigate to the **Apps** tab for that space and add the **Sender** app to it.

You're now ready to use the sample app to send a message to Watson Work!

Back in the terminal window, do the following:
```sh
node lib/app "Examples" "Hello *there*"
```

The Sender app will send `Hello *there*` to the **Examples** space. You
should now see a new "Hello *there*" message in that space.

Layout
---

The example source tree is organized as follows:

```sh
README.md     - this README
package.json  - Node.js package definition

src/          - Javascript sources

  app.js      - main app script

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

Finally, it uses the [Watson Work Spaces API]
(https://workspace.ibm.com/developer/docs) to send a message to the
conversation in the selected space.

How can I contribute?
--

Pull requests welcome!


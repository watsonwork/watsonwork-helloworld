// A sample app that sends a message to Watson Work

// Usage:
// node lib/app "space name" "message text"

import * as request from 'request';
import debug from 'debug';

// Debug log
const log = debug('watsonwork-sender');

// Return the list of spaces the app belongs to
const spaces = (tok, cb) => {
  request.post('https://api.watsonwork.ibm.com/graphql', {
    headers: {
      jwt: tok,
      'Content-Type': 'application/graphql'
    },

    // This is a GraphQL query, used to retrieve the list of spaces
    // visible to the app (given the app OAuth token)
    body: `
      query {
        spaces (first: 50) {
          items {
            title
            id
          }
        }
      }`
  }, (err, res) => {
    if(err || res.statusCode !== 200) {
      log('Error retrieving spaces %o', err || res.statusCode);
      cb(err || new Error(res.statusCode));
      return;
    }

    // Return the list of spaces
    const body = JSON.parse(res.body);
    log('Space query result %o', body.data.spaces.items);
    cb(null, body.data.spaces.items);
  });
};

// Return an OAuth token for the app
const token = (appId, secret, cb) => {
  request.post('https://api.watsonwork.ibm.com/oauth/token', {
    auth: {
      user: appId,
      pass: secret
    },
    json: true,
    form: {
      grant_type: 'client_credentials'
    }
  }, (err, res) => {
    if(err || res.statusCode !== 200) {
      log('Error getting OAuth token %o', err || res.statusCode);
      cb(err || new Error(res.statusCode));
      return;
    }
    cb(null, res.body.access_token);
  });
};

// Send an app message to a space
const send = (spaceId, text, tok, cb) => {
  request.post(
    'https://api.watsonwork.ibm.com/v1/spaces/' + spaceId + '/messages', {
      headers: {
        Authorization: 'Bearer ' + tok
      },
      json: true,
      // An App message can specify a color, a title, markdown text and
      // an 'actor' useful to show where the message is coming from
      body: {
        type: 'appMessage',
        version: 1.0,
        annotations: [{
          type: 'generic',
          version: 1.0,

          color: '#6CB7FB',
          title: 'Sample message',
          text: text,

          actor: {
            name: 'Sample app',
            avatar: 'https://avatars1.githubusercontent.com/u/22985179',
            url: 'https://github.com/watsonwork'
          }
        }]
      }
    }, (err, res) => {
      if(err || res.statusCode !== 201) {
        log('Error sending message %o', err || res.statusCode);
        cb(err || new Error(res.statusCode));
        return;
      }
      log('Send result %d, %o', res.statusCode, res.body);
      cb(null, res.body);
    });
};

// Main app entry point
// Send a message to one or more spaces
export const main = (argv, env, cb) => {

  // Will send a message to the spaces matching the given name
  const name = new RegExp(argv[2]);

  // The text to send, can contain markdown
  const text = argv[3] || 'Hello *there*';

  // Get an OAuth token for the app
  // Expecting app id and secret in env variables
  token(env.SENDER_APP_ID, env.SENDER_APP_SECRET, (err, tok) => {
    if(err) {
      cb(err);
      return;
    }

    // List the spaces the app belongs to
    spaces(tok, (err, slist) => {
      if(err) {
        cb(err);
        return;
      }

      slist
        // Filter the spaces matching the given name
        .filter((space) => name.test(space.title))

        // Send to each matching space
        .map((space) => {

          // Send a message
          log('Sending \'%s\' to space %s', text, space.title);
          send(space.id, text, tok, (err, res) => {
            if(err) {
              cb(err);
              return;
            }
            log('Sent message to space %s', space.title);
            cb(null);
          });
        });
    });
  });
};

if(require.main === module)
  main(process.argv, process.env, (err) => {
    if(err)
      console.log('Error sending message: ', err);
  });


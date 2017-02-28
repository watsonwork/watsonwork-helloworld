// A sample app that sends a 'hello world' message to a space in IBM
// Watson Workspace

// Usage:
// npm run helloworld "space name" ["message text"]

import * as request from 'request';
import debug from 'debug';

// Debug log
const log = debug('watsonwork-helloworld-app');

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

// Send an app message to the conversation in a space
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
          title: 'Sample Message',
          text: text,

          actor: {
            name: 'Sample helloworld app'
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
// Send a message to the conversation in the space matching the given name
export const main = (name, text, appId, secret, cb) => {
  // Get an OAuth token for the app
  token(appId, secret, (err, tok) => {
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

      // Find a space matching the given name
      const space = slist.filter((s) => s.title === name)[0];
      if(!space) {
        cb(new Error('Space not found'));
        return;
      }

      // Send the message
      log('Sending \'%s\' to space %s', text, space.title);
      send(space.id,
        text || 'Hello World! Welcome to **Watson Work**!',
        tok, (err, res) => {
          if(err) {
            cb(err);
            return;
          }
          log('Sent message to space %s', space.title);
          cb(null);
        });
    });
  });
};

if(require.main === module)
  // Run the app
  main(process.argv[2], process.argv[3],
    // Expect the app id and secret to be configured in env variables
    process.env.HELLOWORLD_APP_ID, process.env.HELLOWORLD_APP_SECRET,
    (err) => {
      if(err)
        console.log('Error sending message:', err);
    });


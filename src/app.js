// A sample app that sends a 'hello world' message to a space in IBM
// Watson Workspace

// Usage:
// npm run helloworld "space name" ["message text"]

import * as request from 'request';
import debug from 'debug';
import Promise from 'bluebird';

// Debug log
const log = debug('watsonwork-helloworld-app');

// Promisify to enable async/await construct
const post = Promise.promisify(request.post);


// Return a list of spaces the app belongs to
const spaces = async (tok) => {
  try {
    const res = await post('https://api.watsonwork.ibm.com/graphql', {
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
    });

    // Throw an error if request unsuccesful
    if(res.statusCode !== 200)
      throw new Error(res.statusCode);
    
    // Return the list of spaces
    const body = JSON.parse(res.body);
    log('Space query result %o', body.data.spaces.items);
    return body.data.spaces.items;
  } 
  catch(err) {
    log('Space query result %o', body.data.spaces.items);
    throw err;
  }
};


// Return an OAuth token for the app
const token = async (appId, secret) => {
  try {
    // Authentication request with client_credentials
    const res = await post('https://api.watsonwork.ibm.com/oauth/token', {
      auth: {
        user: appId,
        pass: secret
      },
      json: true,
      form: {
        grant_type: 'client_credentials'
      }
    });

    // Throw an error if request unsuccesful
    if(res.statusCode !== 200)
      throw new Error(res.statusCode);

    // Return the OAuth token
    return res.body.access_token;
  }
  catch(err) {
    log('Error getting OAuth token %o', err || res.statusCode);
    throw err;
  }

};


// Send an app message to the conversation in a space
const send = async (spaceId, text, tok) => {
  
  try {
    const res = await post('https://api.watsonwork.ibm.com/v1/spaces/' + spaceId + '/messages', {
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
    });

    // Throw an error if request unsuccesful
    if(res.statusCode !== 201)
      throw new Error(res.statusCode);
    
    // Return the body of the message response
    log('Send result %d, %o', res.statusCode, res.body);
    return res.body;
  }
  catch(err) {
    log('Error sending message %o', err);
    throw err;
  }
};


// Main app entry point
// Send a message to the conversation in the space matching the given name
export const main =  async (name, text, appId, secret) => {
  try {
    // Get an OAuth token for the app
    var tok = await token(appId, secret);
    // List the spaces the app belongs to
    var spaceList = await spaces(tok); 
    // Find a space matching the given name
    const space = spaceList.filter((s) => s.title === name)[0];
    if (!space)
      throw new Error('Space not found');

    log('Sending \'%s\' to space %s', text, space.title);

    // Send the message
    await send(space.id, 
      text || 'Hello World! Welcome to **Watson Work**!',
      tok);
    log('Sent message to space %s', space.title);
    
  } catch(err) {
    log('Error starting the application %o', error);
    throw err;
  }
};


// Run program as an IIFE (top level await not supported in node)
(async () => {
  if(require.main === module)
    // Run the app
    main(process.argv[2], process.argv[3],
      // Expect the app id and secret to be configured in env variables
      process.env.HELLOWORLD_APP_ID, process.env.HELLOWORLD_APP_SECRET,
      (err) => {
        if(err)
          console.log('Error sending message:', err);
      });
})();
 
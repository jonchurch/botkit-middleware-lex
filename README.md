# Overview

This middleware allows you to send user input to AWS Lex. This gives you access to intent mapping, data slots, NLP, and other capabilites of the Lex service. You can use this middleware to extend your bots capabilites, add an interaction that lives in Lex to an existing bot, or to run a Lex bot with Botkit as the connector.

## Setup

You will need an AWS Lex bot setup. Note the BotName, BotAlias, and AWS region when creating your Lex bot.

In order to use the aws-sdk LexRuntime, you will need to have your aws access keys [configured properly for nodejs](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)

## Message Object

Adds data returned from the Lex api PostText method to incoming message object. Learn more about the PostText method [here](http://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html)

```javascript

        message.lex = {
            intent: 'STRING',
            slots: 'OBJECT',
            session: 'OBJECT',
            messageFormat: 'STRING',
            response: 'STRING',
            dialogState: 'STRING',
            slotToElicit: 'STRING',
            messages: 'ARRAY(OBJECT)' // Support for Composite messages from Lex
        }
```

## Example Usage Receive Middleware

```javascript
var lex = require('botkit-middleware-lex')({
  botName: 'BotkitLex',
  botAlias: 'blex',
  region: 'us-east-1'
})

module.exports = function(controller) {
  
  controller.middleware.receive.use(lex.receive)

// Respond to all incoming text messages with the response from Lex
  controller.on('message', function(bot, message) {
    if (message.text) {
            if (message.lex.messageFormat === 'Composite') {

                for (let index = 0; index < message.lex.messages.length; index++) {
                    const msg = message.lex.messages[index];
                    bot.reply(message, msg.value);
                }
            } else {

                bot.reply(message, message.lex.response);
            }
        }
  })
}
```

## Example Usage Hears Middleware

```javascript
var lex = require('botkit-middleware-lex')({
  botName: 'BotkitLex',
  botAlias: 'blex',
  region: 'us-east-1'
})

module.exports = function(controller) {
  
  controller.middleware.receive.use(lex.receive)

 // listen for a specific Lex Intent
  controller.hears(['default_intent'], 'message', function(bot, message) {
    if (message.text) {
            if (message.lex.messageFormat === 'Composite') {

                for (let index = 0; index < message.lex.messages.length; index++) {
                    const msg = message.lex.messages[index];
                    bot.reply(message, msg.value);
                }

            } else {

                bot.reply(message, message.lex.response);
            }
        }
  })
}
```

## Using Cognito Identity Credentials

Add the AWS SDK package with npm:

```cmd
npm i aws-sdk
```

Change bot.js to include AWS as follows:

```javascript
// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for web.

const { WebAdapter } = require('botbuilder-adapter-web');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

var AWS = require('aws-sdk');

// Load process.env values from .env file
require('dotenv').config();

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:########-####-####-####-############',
});

```

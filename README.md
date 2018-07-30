# Overview

This middleware allows you to send user input to AWS Lex. This gives you access to intent mapping, data slots, NLP, and other capabilites of the Lex service. You can use this middleware to extend your bots capabilites, add an interaction that lives in Lex to an existing bot, or to run a Lex bot with Botkit as the connector.

## Setup

You will need an AWS Lex bot setup. Note the BotName, BotAlias, and AWS region when creating your Lex bot.

In order to use the aws-sdk LexRuntime, you will need to have your aws access keys [configured properly for nodejs](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)

## Message Object

Adds data returned from the Lex api PostText method to incoming message object. Learn more about the PostText method [here](http://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html)


```

        message.lex = {
            intent: 'STRING',
            slots: 'OBJECT',
            session: 'OBJECT' 
            message: 'STRING',
            dialogState: 'STRING',
            slotToElicit: 'STRING'
        }
```


## Example Usage Recieve Middleware

```
var lex = require('botkit-middleware-lex')({
  botName: 'BotkitLex',
  botAlias: 'blex',
  region: 'us-east-1'
})

module.exports = function(controller) {
  
  controller.middleware.receive.use(lex.receive)

// Respond to all incoming text messages with the response from Lex
  controller.on('message_received', function(bot, message) {
    if (message.text) {
            bot.reply(message, message.lex.message)
        }   
  })
}
```
## Example Usage Hears Middleware

```
var lex = require('botkit-middleware-lex')({
  botName: 'BotkitLex',
  botAlias: 'blex',
  region: 'us-east-1'
})

module.exports = function(controller) {
  
  controller.middleware.receive.use(lex.receive)

 // listen for a specific Lex Intent
  controller.hears(['default_intent'], 'message_received', function(bot, message) {
    if (message.text) {
            bot.reply(message, message.lex.message)
        }   
  })
}
```

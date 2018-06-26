var LexRuntime = require('aws-sdk').LexRuntime

module.exports = function(config) {
    
    var lex = new LexRuntime({
        region: config.region
    })
    
    function receive(bot, message, next) {
    
        if (!message.text) {
          next();
          return;
        }

        if (message.is_echo || message.type === 'self_message') {
          next();
          return;
        } 
        var params = {
            botAlias: config.botAlias,
            botName: config.botName,
            inputText: message.text,
            userId: message.user,
            requestAttributes: message.requestAttributes,
            sessionAttributes: message.sessionAttributes
        };
        if (message.text) {
            var request = lex.postText(params, function(err, data) {
                if (err) {
                    next(err)
                } else {
                    message.lex = {
                        intent: data.intentName,
                        slots: data.slots,
                        session: data.sessionAttributes,
                        response: data.message,
                        dialogState: data.dialogState,
                        slotToElicit: data.slotToElicit
                    }
                    next()
                }
            })

        } else {
            next()
        }
    }

    function hears(tests, message) {
        for (var i = 0; i < tests.length; i++) {
            if (message.lex && message.lex.intent === tests[i]) {
                return true;
            }
        }

        return false;
    };
    
    return {
        receive: receive
    }
}

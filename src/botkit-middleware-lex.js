var LexRuntime = require('aws-sdk').LexRuntime
var lex = new LexRuntime({
    region: 'eu-west-1'
})


module.exports = function(config) {

    function receive(bot, message, next) {
        console.log('Running receieve!')
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

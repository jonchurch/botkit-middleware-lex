var LexRuntime = require('aws-sdk').LexRuntime
// At time of writing, us-east-1 is the only supported region for Lex
var lex = new LexRuntime({
    region: 'us-east-1'
})


module.exports = function(config) {

    function receive(bot, message, next) {
        console.log('Running receieve!')
        var params = {
            botAlias: config.botAlias,
            botName: config.botName,
            inputText: message.text,
            userId: message.user,
            sessionAttributes: message.attributes
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

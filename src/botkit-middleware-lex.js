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
            sessionAttributes: {} 
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
                        message: data.message,
                        dialogState: data.dialogueState,
                        slotToElicit: data.slotToElicit
                    }
                    next()
                }
            })

        } else {
            next()
        }
    }
    return {
        receive: receive
    }
}

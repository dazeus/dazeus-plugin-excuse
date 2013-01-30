require('js-methods');
var dazeus = require('dazeus');
var fs = require('fs');

// some constants, change at your will
var DATA = "data/excuses.txt";
var EXCUSE = "excuse";
var LEARN = 'learn';
var FORGET = 'forget';

// and some help messages
var HELP = "To learn a new excuse use }" + EXCUSE +
    " " + LEARN + " [excuse]. To forget an excuse, use }" + EXCUSE +
    " " + FORGET + " [excuse]. To print a random excuse, use }" + EXCUSE + "";
var KNOWN = "I already know that excuse";
var NEWEXCUSE = "Now I can handle any situation with an excuse!";
var UNKNOWN = "That's no excuse!";
var FORGOTTEN = "You're right, that's a terrible excuse.";

// lets parse command line args
var argv = dazeus.optimist().argv;
dazeus.help(argv);
var options = dazeus.optionsFromArgv(argv);

// create the client
var client = dazeus.connect(options, function () {
    client.onCommand(EXCUSE, function (network, user, channel, command, args, what) {
        if (typeof what !== 'undefined') {
            var commandExecuted = false;

            // learn command
            dazeus.isCommand(LEARN, args, function (toLearn) {
                if (toLearn.trim().length > 0) {
                    commandExecuted = true;
                    if (dazeus.appendTo(DATA, toLearn)) {
                        client.reply(network, channel, user, NEWEXCUSE);
                    } else {
                        client.reply(network, channel, user, KNOWN);
                    }
                }
            });

            // forget command
            dazeus.isCommand(FORGET, args, function (toForget) {
                if (toForget.trim().length > 0) {
                    commandExecuted = true;
                    if (dazeus.removeFrom(DATA, toForget)) {
                        client.reply(network, channel, user, FORGOTTEN);
                    } else {
                        client.reply(network, channel, user, UNKNOWN);
                    }
                }
            });

            // show some help
            if (!commandExecuted) {
                client.reply(network, channel, user, HELP);
            }

        // generate a random excuse
        } else {
            client.reply(network, channel, user, dazeus.randomFrom(DATA), false);
        }
    });
});

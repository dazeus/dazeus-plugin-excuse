require('js-methods');
var dazeus = require('dazeus');
var fs = require('fs');

var DATA = "data/excuses.txt";

var HELP = "To learn a new excuse use }excuse learn [excuse]. To forget an excuse, use }excuse forget [excuse]. To print a random excuse, use }excuse";
var KNOWN = "I already know that excuse";
var NEWEXCUSE = "Now I can handle any situation with an excuse!";
var UNKNOWN = "That's no excuse!";
var FORGOTTEN = "You're right, that's a terrible excuse.";

var client = dazeus.connect({path: '/tmp/dazeus.sock'}, function () {
    client.onCommand('excuse', function (network, user, channel, command, args, what) {
        if (typeof what !== 'undefined') {
            if (what === 'learn') {
                if (append(args.trim().substr(5).trim(), DATA)) {
                    client.reply(network, channel, user, NEWEXCUSE);
                } else {
                    client.reply(network, channel, user, KNOWN);
                }
            } else if (what === 'forget') {
                if (remove(args.trim().substr(6).trim(), DATA)) {
                    client.reply(network, channel, user, FORGOTTEN);
                } else {
                    client.reply(network, channel, user, UNKNOWN);
                }
            } else {
                client.reply(network, channel, user, HELP);
            }
        } else {
            var randomExcuse = randomFrom(DATA);
            client.reply(network, channel, user, randomExcuse, false);
        }
    });
});

var randomFrom = function (file) {
    var array = readFile(file);
    return array[Math.floor(Math.random() * array.length)];
};

var readFile = function (file) {
    var fs = require('fs');
    return fs.readFileSync(file).toString().split("\n").filter(function (element) {
        return element.trim().length > 0;
    });
};

var writeFile = function (data, file) {
    var stream = fs.createWriteStream(file, {flags: 'w'});
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            if (typeof data[i] === 'string') {
                stream.write(data[i] + "\n");
            }
        }
    }
    stream.end();
};

var append = function (word, file) {
    var array = readFile(file);
    if (exists(word, file)) {
        return false;
    } else {
        array.push(word);
        writeFile(array, file);
        return true;
    }
};

var remove = function (word, file) {
    var array = readFile(file);
    if (!exists(word, array)) {
        return false;
    } else {
        array = array.filter(function (elem) {
            return elem.trim() !== word.trim();
        });
        writeFile(array, file);
        return true;
    }
};

var exists = function (word, file) {
    if (typeof file === 'string') {
        file = readFile(file);
    }
    for (var i in file) {
        if (file.hasOwnProperty(i)) {
            if (file[i].trim() === word.trim()) {
                return true;
            }
        }
    }
    return false;
};

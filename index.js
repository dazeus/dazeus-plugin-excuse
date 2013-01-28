require('js-methods');
var dazeus = require('dazeus');
var request = require('request');

var URL = 'http://pages.cs.wisc.edu/~ballard/bofh/bofhserver.pl';
var INVALID = "No valid response from " + URL + "";
var REGEX = /<br><font size\s*=\s*"\+2">([\s\S]*?)<\/font>/im;

var client = dazeus.connect({path: '/tmp/dazeus.sock'}, function () {
    client.onCommand('excuse', function (network, user, channel, command) {
        request(URL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var matches = REGEX.exec(body);
                if (matches) {
                    client.reply(network, channel, user, matches[1].trim(), false);
                } else {
                    client.reply(network, channel, user, INVALID);
                }
            } else {
                client.reply(network, channel, user, INVALID);
            }
        });
    });
});

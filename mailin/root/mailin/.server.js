'use strict';

var async = require('async');
var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');


/* Make an http server to receive the webhook. */
var server = express();
server.use(server.router);

server.head('/webhook', function (req, res) {
    console.log('Received head request from webhook.');
    res.send(200);
});

server.post('/webhook', function (req, res) {
    console.log('Receiving webhook.');
    mailSender('Webhooking');
    /* Respond early to avoid timouting the mailin server. */
    // res.send(200);

    /* Parse the multipart form. The attachments are parsed into fields and can
     * be huge, so set the maxFieldsSize accordingly. */
    var form = new multiparty.Form({
        maxFieldsSize: 70000000
    });

    form.on('progress', function () {
        var start = Date.now();
        var lastDisplayedPercentage = -1;
        return function (bytesReceived, bytesExpected) {
            var elapsed = Date.now() - start;
            var percentage = Math.floor(bytesReceived / bytesExpected * 100);
            if (percentage % 20 === 0 && percentage !== lastDisplayedPercentage) {
                lastDisplayedPercentage = percentage;
                console.log('Form upload progress ' +
                    percentage + '% of ' + bytesExpected / 1000000 + 'Mb. ' + elapsed + 'ms');
            }
        };
    }());

    form.parse(req, function (err, fields) {
        console.log(util.inspect(fields.mailinMsg, {
            depth: 5
        }));

        console.log('Parsed fields: ' + Object.keys(fields));

        /* Write down the payload for ulterior inspection. */
        async.auto({
            writeParsedMessage: function (cbAuto) {
                fs.writeFile('payload.json', fields.mailinMsg, cbAuto);
            },
            writeAttachments: function (cbAuto) {
                var msg = JSON.parse(fields.mailinMsg);
                async.eachLimit(msg.attachments, 3, function (attachment, cbEach) {
                    fs.writeFile(attachment.generatedFileName, fields[attachment.generatedFileName], 'base64', cbEach);
                }, cbAuto);
            }
        }, function (err) {
            if (err) {
                console.log(err.stack);
                res.send(500, 'Unable to write payload');
            } else {
                console.log('Webhook payload written.');
                res.send(200);
            }
        });
    });
});

server.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Http server listening on port 3000');
    }
});
server.listen(80, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Http server listening on port 3000');
    }
});
server.listen(465, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Http server listening on port 3000');
    }
});

function mailSender(msg) {
    var smtpConnection = new SmtpConnection({
            port: '465',
            host: 'smtp.gmail.com',
            secure: true
        }),
        //message = options.message || '',
        promise = new Promise(function (resolve, reject) {
            smtpConnection.on('error', function () {
                reject(new Error("Cannot connect to SMTP Host"));
                console.log('error connect');
            });
            smtpConnection.on('connect', function () {
              console.log('connecting');
                resolve();
            });
            smtpConnection.connect();
        });

    return promise.then(function () {
        return new Promise(function (resolve, reject) {
            smtpConnection.login({
                user: 'michelkerlin',
                pass: '5446098km'
            }, function (err) {
                if (err instanceof Error) {
                  console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }).then(function () {
        return new Promise(function (resolve, reject) {
            smtpConnection.send({
                from: 'michelkerlin@gmail.com',
                to: 'michelkerlin@gmail.com'
            }, msg, function (err) {
                if (err instanceof Error) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }).then(function () {
        smtpConnection.quit();
    });

}

//mailSender();

module.exports = exports = mailSender;

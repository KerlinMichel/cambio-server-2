var SmtpConnection = require('smtp-connection');

var express = require('express'),
    app = express(),
    port = 465;
    
var spamIdx = 0;

function mailSender(msg) {
    spamIdx++;
    if(spamIdx > 3)
        return;
    /* if (!options.hasOwnProperty('port') ||
        !options.hasOwnProperty('host') ||
        !options.hasOwnProperty('email') ||
        !options.hasOwnProperty('password')) {
        throw new Error("Invalid Options");
    }
    if (!options.hasOwnProperty('message')) {
        throw new Error("No message");
    }
    if (typeof options.ssl !== "boolean") {
        throw new Error("options.ssl has to be a Boolean");
    }*/

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

mailSender('asd');

module.exports = exports = mailSender;

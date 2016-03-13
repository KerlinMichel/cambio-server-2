//
// # LetsTakeSomeWebHooks
//
// A simple webhooks server
//
var http = require('http');
var path = require('path');

var SmtpConnection = require('smtp-connection');

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = [80, 465];

app.use(bodyParser.json());

var spamIDx = 0;

var request = require('request');
var url ='http://jwgames.me:8080/bin/ee3303f9-2914-4dcc-bc6e-84c824c6e2b8';
/*var url2 = 'http://jwgames.me:8080/bin/ee3303f9-2914-4dcc-bc6e-84c824c6e2b8';

var jar = request.jar();
jar.setCookie(request.cookie("foo=bar"), "http://jwgames.me:8080/bin/ee3303f9-2914-4dcc-bc6e-84c824c6e2b8");
jar.setCookie(request.cookie("bar=baz"), "http://jwgames.me:8080/bin/ee3303f9-2914-4dcc-bc6e-84c824c6e2b8");

var options = { method: 'POST',
  url: 'http://jwgames.me:8080/bin/ee3303f9-2914-4dcc-bc6e-84c824c6e2b8',
  qs: { foo: [ 'bar', 'baz' ] },
  headers: 
   { 'content-type': 'application/x-www-form-urlencoded',
     accept: 'application/json' },
  form: { foo: 'bar', bar: 'baz' },
  jar: 'JAR' };*/

app.post('/', function (req, res) {
    var body = req.body;
    //var trackingNumber = body.msg.tracking_number;
    //var slug = body.msg.slug;
    //var token = body.msg.unique_token;
    request(url, function (error, response, body) {
         //mailSender(body);
         mailSender('body').then(function () {
             console.log('HIT ---->');
         }, function () {
             console.log('FAILED ---->');
         });
        if (!error) {
            console.log('erro');
            console.log(body);
        } else {
            console.log(body);
        }
    });
    
    /*request(url2, function (error, response, body) {
    if (error) throw new Error(error);
        console.log(body);
    });*/
    
    console.log(req);
    console.log(body);
    console.log(body.text);
    console.log(body.from.address);
    //console.log(trackingNumber, slug, token);

    res.json({
        message: 'ok got it!'
    });
});
var URi = 'https://duckduckgo.com/?q=freedom&ia=meanings';
app.get('/', function(req, res){
    //mailSender('body');
    var info = request('http://fuckyeahmarkdown.com/go?u=' + URi, 
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the markdown for the webpage
        }
    });
    mailSender(info);
  res.send('hello world');
});



var server = app.listen(port[0], function () {

    var host = server.address().address
    //console.log(port);
    console.log('%%%%%%%%%%');
    console.log(server.address().port);
    var port = server.address().port;

    console.log('LETS GET SOME HOOKS BOI at http://%s:%s', host, port)

});

var server2 = app.listen(port[1], function () {

    var host = server2.address().address
    //console.log(port);
    console.log('%%%%%%%%%%');
    console.log(server2.address().port);
    var port = server2.address().port;

    console.log('LETS GET SOME HOOKS BOI at http://%s:%s', host, port);
    console.log(mailSender('test'));

});

function mailSender(msg) {
    //spamIdx++;
    //if(spamIdx > 3)
        //return;
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

//mailSender();

module.exports = exports = mailSender;

var server = require("isotope-dev").create(9001);

function first(obj) {
    for (var a in obj) return a;
}

server.post("", function(response, request) {
    if (request.headers["x-github-event"] === 'ping') {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("pong");
    } else {
        server.extract_data(request, function(data) {
            data = JSON.parse(first(data));
            if (typeof listeners[data.repository.full_name] === 'function') {
                listeners[data.repository.full_name](data.repository);
            }
            if (typeof listeners.any === 'function') {
                listeners.any(data.repository);
            }
        });
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("recieved!");
    }
});

server.meta.define404(function(response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end(":O the webhook server hit a snag!!");
});


listeners = {};

listen = function(repo, cb) {
    listeners[repo] = cb;
}

exports.listen = listen;

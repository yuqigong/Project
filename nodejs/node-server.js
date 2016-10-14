var http = require('http');
var os = require('os');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello nodejs !!!!\n');

}).listen(9080);

console.log('Server running at http://127.0.0.1:9080/');
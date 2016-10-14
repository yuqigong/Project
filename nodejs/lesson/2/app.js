var express = require('express');
var utility = require('utility');

var app = express();

app.get('/', function(req, res) {
    var str = req.query.q;
    var md5val = str ? utility.md5(str) : '请输入～';
    res.send(md5val);
});

app.listen(3000, function() {
    console.log('app is running at port 3000');
});

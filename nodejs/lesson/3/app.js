var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(req, res, next) {
    superagent.get('http://osxdaily.com/')
        .end(function(err, sres) {
            if (err) {
                return next(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];
            $('#content .post').each(function(idx, elem) {
                var $elem = $(elem);
                items.push({
                    title: $elem.find('h2').html(),
                    href: $elem.find('a').attr('href')
                });
            });

            res.send('items');
        });
});

app.listen(3000, function() {
    console.log('app is running at port 3000')
});

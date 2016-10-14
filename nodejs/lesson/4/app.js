var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');

var read = require('./read');

var app = express();

var domainUrl = 'http://www.qiushibaike.com';

app.get('/', function(req, res) {

    // 列表
    var categorys = [];
    
    async.series([
        function (done) {
            superagent.get(domainUrl)
            .end(function(err, sres){
                if (err) {
                    return done(err);
                }

                // 中文转码有问题 decodeEntities
                var $ = cheerio.load(sres.text, {decodeEntities: false});

                $('#menu a').each(function (idx, elem) {
                    var $elem = $(elem);

                    categorys.push({
                        href: url.resolve(domainUrl, $elem.attr('href')),
                        categorys: $elem.text()
                    });

                });

                done(null , categorys);
            });
        },
        function (done) {

            var all = [];
            var currtUrl = categorys[0].href;

            read.categoryList(currtUrl, function (err, data) {
                if (err) {
                    return done(err);
                }

                if (data && data.length > 0) {
                    all = all.concat(data);
                }

                done(null, all);

            });

        }
    ],function (err, results) {
        if( err ) {
            console.log('A file failed to process');
        } else {
            res.send(results);
            console.log('All files have been processed successfully');
        }
    });

});

app.listen(3000, function() {
    console.log('app is running at port 3000');
});



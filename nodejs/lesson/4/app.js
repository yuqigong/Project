var express = require('express');
var cheerio = require('cheerio');
var async = require('async');

var categoryTags = require('./categoryTags');
var categoryList = require('./categoryList');

var app = express();

var categoryUrl = 'http://www.qiushibaike.com';

app.get('/', function(req, res) {

    async.waterfall([
        function (callback) {

            categoryTags.get(categoryUrl, function (err, tags) {
                callback(err, tags);
            });

        },
        function (categorys, callback) {

            if (!categorys || categorys.length < 1) {
                callback('分类信息为空');
            }

            categoryList.get(categorys, function (err, list) {
                callback(err, list);
            });

        }
    ], function (err, result) {
        if( err ) {
            console.log('App to failed');
        } else {
            res.send(result);
            console.log('All files have been processed successfully');
        }
    });

});

app.listen(3000, function() {
    console.log('app is running at port 3000');
});



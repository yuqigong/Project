/**
 * Created by gongyuqi on 16/10/13.
 */
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');

exports.get = function (data, handler) {

    // var pageUrl = data[2].href;
    //
    // superagent.get(pageUrl)
    // .end(function(err, sres){
    //     if (err) {
    //         return handler(err, 'CategoryList Error');
    //     }
    //
    //     // 中文转码有问题 decodeEntities
    //     var $ = cheerio.load(sres.text, {decodeEntities: false});
    //
    //     // 列表
    //     var list = [];
    //     $('#content-left .article').each(function (idx, elem) {
    //         var $elem = $(elem);
    //
    //         list.push({
    //             href: url.resolve(pageUrl, $elem.find('.contentHerf').attr('href')),
    //             content: $elem.find('.contentHerf span').text(),
    //             author: $elem.find('.author h2').text()
    //         });
    //
    //     });
    //
    //     handler(list);
    //
    // });


    // 列表
    var list = [];

    async.eachSeries(data, function(file, callback) {

        var pageUrl = file.href;

        console.log(pageUrl);

        superagent.get(pageUrl)
        .end(function(err, sres){
            if (err) {
                return callback('Each Error');
            }

            // 中文转码有问题 decodeEntities
            var $ = cheerio.load(sres.text, {decodeEntities: false});
            $('#content .col1 .article').each(function (idx, elem) {
                var $elem = $(elem);

                list.push({
                    tag: pageUrl,
                    href: url.resolve(pageUrl, $elem.find('.contentHerf').attr('href')),
                    content: $elem.find('.contentHerf span').text(),
                    author: $elem.find('.author h2').text()
                });

            });

            callback();

        });

    }, function(err) {
        if( err ) {
            handler(err, list);
            console.log('CategoryList be failed');
        } else {
            handler(null, list);
            console.log('CategoryList be successfully');
        }
    });

};
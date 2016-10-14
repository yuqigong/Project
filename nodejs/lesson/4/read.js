/**
 * Created by gongyuqi on 16/10/13.
 */
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

exports.categoryList = function (currtUrl, callback) {
    superagent.get(currtUrl)
    .end(function(err, sres){
        if (err) {
            return callback(err);
        }

        // 中文转码有问题 decodeEntities
        var $ = cheerio.load(sres.text, {decodeEntities: false});

        // 列表
        var items = [];
        $('#content-left .article').each(function (idx, elem) {
            var $elem = $(elem);

            items.push({
                href: url.resolve(currtUrl, $elem.find('.contentHerf').attr('href')),
                content: $elem.find('.contentHerf span').text(),
                author: $elem.find('.author h2').text()
            });

        });

        callback(null, items);
    });
};
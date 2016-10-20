/**
 * Created by gongyuqi on 16/10/20.
 */
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var _ = require('lodash');

exports.get = function (categoryUrl, handler) {

    if (!categoryUrl) return;

    superagent.get(categoryUrl)
        .end(function(err, sres){
            if (err) {
                return handler(err, 'CategoryTags Error');
            }

            // 中文转码有问题 decodeEntities
            var $ = cheerio.load(sres.text, {decodeEntities: false});

            // 类别列表
            var tags = [];

            $('#menu a').each(function (idx, elem) {
                var $elem = $(elem);

                var addr = /^(\/)+/.test($elem.attr('href')) ? $elem.attr('href') : '';

                tags.push({
                    href: url.resolve(categoryUrl, addr),
                    categoryName: $elem.text()
                });

            });

            console.log(_.uniq(tags, 'href'));

            handler(null, tags);

        });

};
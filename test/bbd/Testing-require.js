/**
 * Created by yuqigong on 15/10/2.
 */

var assert = require('assert');

function ok(expr, msg) {
    if (!expr) throw new Error(msg);
}

function reverse(a, b) {
    if (a > b) {
        return a - b;
    } else {
        return 0;
    }
}

function format(string, values) {
    for (var key in values) {
        string = string.replace(new RegExp("\{" + key + "}", "g"), values[key]);
    }
    return string;
}


describe('#Array', function() {
    it(function() {
        //...
    })

    it('-indexOf()', function() {
        it('should return -1 when not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
/**
 * Created by yuqigong on 15/10/2.
 */
suite('#Array');

test('-length', function() {
    var arr = [1, 2, 3];
    ok(arr.length = 3);
});

test('-indexOf', function() {
    var arr = [1, 2, 3];
    ok(arr.indexOf(1) == 0);
    ok(arr.indexOf(2) == 1);
    ok(arr.indexOf(3) == 2);
});

suite('#String');

test('-length', function() {
    ok('foo'.length == 3);
});

suite('#Custom');

test('-减法测试', function() {
    ok(1 == reverse(2, 1), "ok");
    ok(0 == reverse(2, 2), "ok");
    ok(0 == reverse(-1, 2), "ok");
});

test("-basics", function() {
    var values = {
        name: "World"
    };
    assert.equal(format("Hello, {name}", values), "Hello, World", "单个匹配");
    assert.equal(format("Hello, {name}, how is {name} today?", values),
        "Hello, World, how is World today?", "多个匹配");
});

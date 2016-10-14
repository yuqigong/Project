/**
 * Created by yuqigong on 15/10/6.
 */
var assert = require('assert');

/**
 * @description 封装Card的跳转方法
 * @type {Object}
 */
var CardGo = {};

// Hybrid下默认跳转，不新开webview跳转，需要带from参数
CardGo.toHybrid = function(url) {
    if (url) {
        Lizard.jump(url, {
            targetModel: 4
        });
    }
};

// Hybrid下在当前webview跳转，需要带from参数
CardGo.toHybridCurrentView = function(url) {
    if (url) {
        var oURL = getUrlObj(url) || {};
        // http://svn.ui.sh.ctripcorp.com/lizard/2.1/doc/Service.cGuiderService.html
        // cross H5跨模块/站点跳转
        Guider.cross({
            path: oURL.buName,
            param: 'index.html#' + oURL.url
        });
    }
};

// Hybrid下ctrip协议链接直接跳转（新开webview）
CardGo.toHybridCtripProto = function(url) {
    url && cHybridShell.Fn('open_url').run(url, 1);
};

// Hybrid下H5直连打开页面（新开webview）
CardGo.toHybridStraightToH5 = function(url, title) {
    if (url) {
        Guider.jump({
            url: url,
            targetModel: 'h5',
            title: title || ''
        });
    }
};

// H5跳转方式，需要传from
CardGo.toH5 = function(url) {
    url && Lizard.jump(url);
};

// online跳转方式，需要传from
CardGo.toOnline = function(url) {
    url && (location.href = url);
};

/**
 * @description 封装View的跳转方法
 * @type {Object}
 */
var viewGo = function() {
    console.log('Sorry, is not done!');
};

/**
 * @private
 * @description 返回一个包含URL的对象
 * @return {object} [URL数据对象]
 */
var getUrlObj = function() {
    var url = arguments[0] || '';
    var reg = /.*(\/webapp\/)(\w*)(\/)(.*)/,
        result = reg.exec(url.toLowerCase()) || [],
        origin = result[4] || '';

    if (!result[2] || !origin) {
        return null;
    }

    return {
        buName: result[2],
        url: origin
    };
};

/**
 * @description jump对象，单例设计
 * @return {[object]}   jump实例
 */
var jump = (function() {

    var Method = function() {
        /**
         * @public
         * @description go接口,实现Card的跳转方法
         */
        this.go = CardGo;
        /**
         * @public
         * @description goto接口，实现View的跳转方法；暂无实现
         */
        this.goto = viewGo;
    };

    // 实例容器
    var instantiated;

    // 公有变量和方法（可以访问私有变量和方法）
    return {
        getInstance: function() {
            if (!instantiated) {
                instantiated = new Method();
            }
            return instantiated;
        }
    };
})();

suite('#getUrlObj');

test('-"/webapp/myctrip/orders/allorders": URL格式正确，返回一个对象', function() {
    assert.ok(getUrlObj('/webapp/myctrip/orders/allorders'), 'URL格式正确，返回一个对象');
});

test('-"webapp/myctrip/orders/allorders": URL格式有误:webapp 前缺少"/"', function() {
    assert.ok(!getUrlObj('webapp/myctrip/orders/allorders'), 'URL格式有误:webapp 前缺少“/”');
});

test('-"/myctrip/orders/allorders": URL格式有误:缺少 webapp', function() {
    assert.ok(!getUrlObj('/myctrip/orders/allorders'), 'URL格式有误:缺少 webapp');
});

suite('#jump');

var f = jump.getInstance();

test('-jump.go Card方法集合', function() {
    var flag = f.go instanceof Object;
    assert.equal(true, flag, 'go 是 jump 的方法集合');
});

test('-jump.goto View方法集合', function() {
    var flag = f.goto instanceof Object;
    assert.equal(true, flag, 'goto 是 jump 的方法集合');
});

test('-jump.go.toHybrid()方法', function() {
    var flag = typeof f.go.toHybrid === 'function';
    assert.equal(true, flag, 'toHybrid 是 jump 的方法');
});

test('-jump.go.toH5()方法', function() {
    var flag = typeof f.go.toH5 === 'function';
    assert.equal(true, flag, 'toH5 是 jump 的方法');
});

test('-jump.go.toHybridCtripProto()方法', function() {
    var flag = typeof f.go.toHybridCtripProto === 'function';
    assert.equal(true, flag, 'toHybridCtripProto 是 jump 的方法');
});

test('-jump.go.toHybridCurrentView()方法', function() {
    var flag = typeof f.go.toHybridCurrentView === 'function';
    assert.equal(true, flag, 'toHybridCurrentView 是 jump 的方法');
});

test('-jump.go.toHybridStraightToH5()方法', function() {
    var flag = typeof f.go.toHybridStraightToH5 === 'function';
    assert.equal(true, flag, 'toHybridStraightToH5 是 jump 的方法');
});

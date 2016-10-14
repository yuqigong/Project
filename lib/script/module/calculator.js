/* global deepCopy, C*/
var Calculator = {
    Version: '0.1.0',
    Name: 'Calculator',
    Backup: null,
    util: {
        // 深度拷贝
        deepCopy: function(source) {
            var result = {},
                key;
            for (key in source) { // jshint ignore:line
                result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
            }
            return result;
        }
    },
    Cache: {
        // 第一个数
        x: undefined,
        // 第二个数
        y: undefined,
        // 结果
        result: undefined,
        // 上一个结果
        orig: undefined,
        // 操作符
        oper: '',
        // 上一个操作符
        nextoper: '',
        // 最大长度
        maxlength: 10,
        // 字符串长度
        strlength: 1,
        // 时间戳
        time: 0,
        // 计算次数
        history: 0
    },
    init: function() {
        var Opts = arguments[0];
        var oCalc = $('#' + Opts.id);
        var oView = oCalc.find('.' + Opts.viewClass);
        var oKeymap = oCalc.find('.' + Opts.keymapClass);

        window.C = Calculator || null;
        window.C.$View = oView || null;
        window.C.$Keymap = oKeymap || null;
        // window.C.startTime = (new Date()).getTime();

        window.C.View = C.view();
        window.C.Keymap = C.keymap();

        C.View.init();
        C.Keymap.init();
    },
    keymap: function() {
        console.log('keymap init successful');

        var first = [],
            second = [],
            x, y;
        // 默认不是负数
        var isNegative = false;
        var tag = '-';

        // 字符串长度控制开关
        var isContinue;
        var view = C.view(); // jshint ignore:line

        var input = {
            number: function() {
                var value = arguments[0];
                // 如果输入长度超出，则截断
                if (!isContinue) return; // jshint ignore:line
                // console.log('数字');
                // 通过运算符来判断第一个数或第二个数
                if (C.Cache.result) {
                    console.log('Todo');
                } else {
                    if (C.Cache.oper === '') { // 第一个数
                        first.push(value);
                        x = first.join('');
                        // 防止出现多个零
                        if ((x.indexOf('.') < 0) && parseFloat(x) === 0) { // jshint ignore:line
                            first.length = 0;
                            x = '0';
                        }
                        // 更新model
                        C.Cache.x = x;
                        // 显示输入的数值
                        C.View.show(x);
                    } else { // 第二个数
                        second.push(value);
                        y = second.join('');
                        // 防止出现多个零
                        if ((y.indexOf('.') < 0) && parseFloat(y) === 0) { // jshint ignore:line
                            second.length = 0;
                            y = '0';
                        }
                        // 更新model
                        C.Cache.y = y;
                        // 显示输入的数值
                        C.View.show(y);
                    }
                }
            },
            clean: function() { // 清空
                first = [];
                second = [];
                x = undefined;
                y = undefined;
                C.View.clean();
            },
            negative: function() { // 正负数
                // 如果是输入，则对输入值添加‘-’
                // 如果是计算，则对结果添加‘-’；
                // isNegative, 默认表示非负数
                if (typeof C.Cache.result === 'undefined') { // 输入
                    // 判断输入的是第一个数还是第二个数
                    if (C.Cache.oper === '') {
                        if (!isNegative) {
                            first.unshift(tag);
                            isNegative = true;
                        } else {
                            first.shift();
                            isNegative = false;
                        }
                        x = first.join('');
                        C.Cache.x = x;
                        C.View.show(x);
                    } else {
                        if (!isNegative) {
                            second.unshift(tag);
                            isNegative = true;
                        } else {
                            second.shift();
                            isNegative = false;
                        }
                        y = second.join('');
                        C.Cache.y = y;
                        C.View.show(y);
                    }
                } else { // 计算
                    var r = C.Cache.result;
                    if (typeof r === 'number' && r > 0) {
                        isNegative = false;
                    } else {
                        isNegative = true;
                    }
                    // 将数值转换正负
                    r = 0 - r;
                    // 将 r 值代入 C.Cache.x
                    // calculate.y 不变，运算符也不变
                    C.Cache.x = r;
                    C.Cache.result = r;
                    C.View.show(r);
                }
            },
            floatPointNum: function() { // 浮点数
                var point = '.';
                // 如果输入长度超出，则截断
                if (!isContinue) return; // jshint ignore:line
                // 判断输入的是第一个数还是第二个数
                if (C.Cache.oper === '') {
                    // 如果输入以 ‘0.’ 或者 ‘.’ 开头
                    // 那么默认添加一位数，0
                    if (typeof C.Cache.x === 'undefined' || C.Cache.x === '0') {
                        C.Cache.x = '0';
                        first.push('0');
                    }
                    // 防止出现多个点
                    if (C.Cache.x.indexOf('.') > -1) return; // jshint ignore:line
                    first.push(point);
                    x = first.join('');
                    C.Cache.x = x;
                    C.View.show(x);
                } else {
                    if (typeof C.Cache.y === 'undefined' || C.Cache.y === '0') {
                        C.Cache.y = '0';
                        second.push('0');
                    }
                    // 防止出现多个点
                    if (C.Cache.y.indexOf('.') > -1) return; // jshint ignore:line
                    second.push(point);
                    y = second.join('');
                    C.Cache.y = y;
                    C.View.show(y);
                }
            },
            calc: function() {
                var oper = arguments[0];
                if (oper !== '=') {
                	C.Cache.oper = oper;
                }
                C.calc();
            }
        };

        return {
            init: function() {
                C.$Keymap.on('click', 'td', function() {
                    var value = $(this).data('value');
                    // 更新缓存时间
                    C.Cache.time = (new Date()).getTime();
                    // 字符串长度控制开关
                    isContinue = true;
                    // 输入长度不可超过10位
                    if (C.Cache.maxlength <= C.Cache.strlength) {
                        isContinue = false;
                    }

                    if (!isNaN(value)) { // 数字
                        // 调用数字输入方法
                        input.number(value);
                    } else { // 字符
                        if (value === 'c') { // 清空
                            input.clean();
                        } else if (value === '+/-') { // 正负数
                            input.negative();
                        } else if (value === '.') { // 浮点数
                            input.floatPointNum();
                        } else {
                            input.calc(value);
                        }
                    }
                });
            }
        };
    },
    view: function() {
        var render = {
            /// 将计算器屏幕归零
            clean: function() {
                // 初始化计算器，显示为 0
                C.$View.html('<em style="font-style: normal;font-size:97px">0</em>');
            },
            // 显示
            show: function() {
                // 判断参数的类型
                var value = arguments[0];

                // 取绝对值，保证位数，即字符串长度一致
                var abs;
                // 如果传入的值为 ‘0.’ 或者 ‘.’，都显示为 ‘0.’
                if (value.toString() === '0.' || value.toString() === '.') {
                    value = '0.';
                    abs = value.toString();
                } else {
                    if (value.toString().indexOf('.') > -1) { // 浮点数
                        if (value.toString().indexOf('0', value.toString().length - 1) > -1) { // 末尾为零
                            abs = value.toString();
                        } else { // 末尾不为零
                            abs = Math.abs(parseFloat(value));
                        }
                    } else { // 非浮点数
                        if (parseFloat(value) === 0) {
                            value = 0;
                            abs = value.toString();
                        } else {
                            abs = Math.abs(parseFloat(value));
                        }
                    }
                }

                var fontSize = ['97px', '82px', '66px', '60px', '50px'];
                var lvl = 0,
                    len = C.Cache.strlength = abs.toString().length,
                    fs = fontSize.length,
                    str = '',
                    n = 5;
                // 当输入变大时，字体跟随变化
                if (len > n && lvl < fs) {
                    lvl = (len - n) >= n ? (fs - 1) : (len - n); // jshint ignore:line
                }
                str = '<em style="font-style: normal;font-size:' + fontSize[lvl] + '">' + value + '</em>';
                C.$View.html(str);
            }
        };

        return {
            init: function() {
                console.log('view init successful');
                // 将第一次的缓存数据 backup
                if (C.Cache.time === 0) {
                    C.Backup = C.util.deepCopy(C.Cache);
                }
                render.clean();
            },
            clean: function() {
                console.log('view is clean');
                C.Backup.time = (new Date()).getTime();
                C.Cache = C.util.deepCopy(C.Backup);
                render.clean();
            },
            show: function() {
                console.log('view is show');
                var model = arguments[0];
                if (typeof model === 'undefined') return; // jshint ignore:line
                render.show(model);
            },
            reset: function() {
                console.log('view is reset');
                C.Backup.time = 0;
                C.Cache = C.Backup;
                render.clean();
            }
        };
    },
    calc: function() {
        console.log('calc running successful');
        console.log(C.Cache);
        /* jshint ignore:start */
        var methods = function() {
            var Opts = arguments[0],
                r;
            var oper = Opts.oper,
                x = parseFloat(Opts.x),
                y = parseFloat(Opts.y);

            // 运算符
            var Symbol = ['+', '-', '*', '/', '%'];
            var Opeator = {
                PLUS: Symbol[0],
                MINUS: Symbol[1],
                MULTIPLY: Symbol[2],
                DIVIDE: Symbol[3],
                REMAINDER: Symbol[4]
            };

            this.error = function() {
                r = '无法计算';
                return r;
            };

            this.plus = function() {
                var r1, r2, m, c;
                try {
                    r1 = x.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = y.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                c = Math.abs(r1 - r2);
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        x = Number(x.toString().replace('.', ''));
                        y = Number(y.toString().replace('.', '')) * cm;
                    } else {
                        x = Number(x.toString().replace('.', '')) * cm;
                        y = Number(y.toString().replace('.', ''));
                    }
                } else {
                    x = Number(x.toString().replace('.', ''));
                    y = Number(y.toString().replace('.', ''));
                }
                r = (x + y) / m;
                return r;
            };

            this.minus = function() {
                var r1, r2, m, n;
                try {
                    r1 = x.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = y.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
                n = (r1 >= r2) ? r1 : r2; // jshint ignore:line
                r = ((x * m - y * m) / m).toFixed(n);
                return r;
            };

            this.multiply = function() {
                var m = 0,
                    s1 = x.toString(),
                    s2 = y.toString();
                try {
                    m += s1.split('.')[1].length;
                } catch (e) {}
                try {
                    m += s2.split('.')[1].length;
                } catch (e) {}
                r = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
                return r;
            };

            this.divide = function() {
                var t1 = 0,
                    t2 = 0,
                    r1, r2;
                try {
                    t1 = x.toString().split('.')[1].length;
                } catch (e) {}
                try {
                    t2 = y.toString().split('.')[1].length;
                } catch (e) {}

                r1 = Number(x.toString().replace('.', ''));
                r2 = Number(y.toString().replace('.', ''));
                r = (r1 / r2) * Math.pow(10, t2 - t1); // jshint ignore:line
                return r;
            };

            this.remainder = function() {
                r = parseFloat(x / 100);
                return r;
            };

            switch (oper) {
                case Opeator.PLUS:
                    this.plus();
                    break;
                case Opeator.MINUS:
                    this.minus();
                    break;
                case Opeator.MULTIPLY:
                    this.multiply();
                    break;
                case Opeator.DIVIDE:
                    this.divide();
                    break;
                case Opeator.REMAINDER:
                    this.remainder();
                    break;
                default:
                    this.error();
                    break;
            }

            return r;
        };
        // 默认为一则运算
        var operatorLvl = 1;
        var objLvl = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };

        var x = C.Cache.x,
            y = C.Cache.y,
            oper = C.Cache.oper;

        if (typeof x === 'undefined' || typeof y === 'undefined' || oper === '') return;
        // 累计计算次数
        C.Cache.history += 1;

        C.Cache.result = methods(C.Cache);
        // C.Cache.nextoper = C.Cache.oper;
        C.View.show(C.Cache.result);
        /* jshint ignore:end */
    }
};

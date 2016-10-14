/**
 *
 * [jLight A lightweight Javascript class libraries]
 * author: yuqigong
 * date: 2014-09-01
 * version: 0.1.0
 *
 */
(function() {

    window['jLight'] = {};

    /**
     * [$ description]
     * @return {[type]} [description]
     */

    function $() {
        var elements = new Array();
        // 将传来的参数进行遍历
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            // 若参数为字符串类型，则取得该参数的id
            if (typeof element == 'string') {
                element = document.getElementById(element);
            }
            // 若参数长度为1，即只传递进来一个参数，则直接返回
            if (arguments.length == 1) {
                return element;
            }
            // 若有多个参数传递进来，则将处理后的值压入elements数组中
            elements.push(element);
        }
        // 返回处理后的参数
        return elements;
    }

    // 把创建的函数$注册到 'window.jLight'命名空间中
    window['jLight']['$'] = $;

    /**
     * [getElementsByClassName description]
     * @param  {[type]} className [类名]
     * @param  {[type]} tag       [标签名]
     * @return {[type]}           [description]
     */

    function getElementsByClassName(className, tag) {
        // 对tag进行过滤，取出所有对象，如取出所有input类型对象。
        var allTags = document.getElementsByTagName(tag);
        var matchingElements = new Array();

        // 正则表达式
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

        var element;

        // 将取出的tag对象存入数组中。
        for (var i = 0; i < allTags.length; i++) {
            element = allTags[i];
            if (regex.test(element.className)) {
                matchingElements.push(element);
            }
        }
        return matchingElements;
    }

    // 把创建的函数getElementsByClassName注册到 'window.jLight'命名空间中
    window['jLight']['getElementsByClassName'] = getElementsByClassName;

    /**
     * [addEvent description]
     * @param {[type]}   obj  [事件对象]
     * @param {[type]}   type [事件名称]
     * @param {Function} fn   [回调函数]
     */

    function addEvent(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function() {
                obj['e' + type + fn](window.event);
            }
            obj.attachEvent('on' + type, obj[type + fn]);
        } else
            obj.addEventListener(type, fn, false);
    }

    // 把创建的函数addEvent注册到 'window.jLight'命名空间中
    window['jLight']['addEvent'] = addEvent;

    /**
     * [removeEvent description]
     * @param  {[type]}   obj  [事件对象]
     * @param  {[type]}   type [事件名称]
     * @param  {Function} fn   [回调函数]
     */

    function removeEvent(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent('on' + type, obj[type + fn]);
            obj[type + fn] = null;
        } else
            obj.removeEventListener(type, fn, false);
    }

    // 把创建的函数removeEvent注册到 'window.jLight'命名空间中
    window['jLight']['removeEvent'] = removeEvent;

    /**
     * [insertAfter description]
     * @param  {[type]} newElem    [description]
     * @param  {[type]} targetElem [description]
     * @return {[type]}            [description]
     */

    function insertAfter(newElem, targetElem) {
        // 父级元素
        var parent = targetElem.parentNode;
        // 检查元素是不是最后一个子元素
        // 即比较 parent 元素的 lastChild 属性与目标元素相等
        if (parent.lastChild == targetElem) {
            // 如果是 parent 元素的最后一个子元素，
            // 即用 appendChild 追加到目标元素之后
            parent.appendChild(newElem);
        } else {
            // 否则，就把新元素插入到目标元素和目标下一个元素之间
            parent.inserBefore(newElem, targetElem.nextSibling);
        }
    }

    // 把创建的函数insertAfter注册到 'window.jLight'命名空间中
    window['jLight']['insertAfter'] = insertAfter;
})();
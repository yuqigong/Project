/*
For HTML5 placeholder
call method:
all input : PlaceHolder.init();
one input : PlaceHolder.init(document.getElmentById("XXX"));
more input : PlaceHolder.init(document.getElmentById("XXX"),document.getElmentById("XX"),...,document.getElmentById("XXN"));
*/

var PlaceHolder = {
    _support: (function() {
        return 'placeholder' in document.createElement('input');
    })(),

    //提示文字的样式，需要在页面中其他位置定义
    //className: 'PlaceHolder_style',
    classText: "color:#666",
    init: function(obj) {
        var inputs = obj;
        if (!PlaceHolder._support) {
            if (!inputs) {
                inputs = document.getElementsByTagName('input');
                inputs += document.getElementsByTagName('textarea');
            }
            if (arguments.length > 1) {
                inputs = arguments;
            }
            PlaceHolder.create(inputs);
        }
    },
    create: function(inputs) {
        var input;
        if (!inputs.length) {
            inputs = [inputs];
        }
        for (var i = 0, length = inputs.length; i < length; i++) {
            input = inputs[i];
            if (!PlaceHolder._support && input.attributes && input.attributes.placeholder) {
                PlaceHolder._setValue(input);
                PlaceHolder.addEvent(input, 'focus', function(e) {
                    if (this.value === this.attributes.placeholder.nodeValue) {
                        PlaceHolder._clearValue(this);
                    }
                });
                PlaceHolder.addEvent(input, 'blur', function(e) {
                    if (this.value === '') {
                        PlaceHolder._setValue(this);
                    }
                });
            }
        }
    },
    _clearValue: function(input) {
        input.value = "";
        //input.className = PlaceHolder.className;
        if (!+"\v1") {
            input.style.setAttribute("cssText", "");
        } else {
            input.setAttribute("style", "");
        }
    },
    _setValue: function(input) {
        input.value = input.attributes.placeholder.nodeValue;
        //input.className = PlaceHolder.className;
        if (!+"\v1") {
            input.style.setAttribute("cssText", PlaceHolder.classText);
        } else {
            input.setAttribute("style", PlaceHolder.classText);
        }
    },
    addEvent: function(obj, eventtype, listener) {
        if (obj.addEventListener) {
            obj.addEventListener(eventtype, listener, false)
            return true
        } else if (obj.attachEvent) {
            obj['e' + eventtype + listener] = listener;
            obj[eventtype + listener] = function() {
                obj['e' + eventtype + listener](window.event);
            }
            obj.attachEvent('on' + eventtype, obj[eventtype + listener]);
            return true;
        }
        return false;
    }
};

/**
 * JS日期控件
 * @author  yuqigong
 * @date 2016-8-3
 */

// 依赖 Calendar 模块

// var dpker = Datepicker.getInstance();

(function(Calendar) {

    var _root = this;

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }

    var Datepicker = function() {
        this.Cal = Calendar.getInstance({
            id: 'start',
            onSelect: function(evt, elem) {

                if (evt.target && evt.target.nodeName.toUpperCase() === 'TD') {

                    var TDs = elem.getElementsByTagName('td'),
                        day = +evt.target.innerHTML;

                    for (var i = 0; i < TDs.length; i++) {
                        var d1 = new Date(this.cYear, this.cMonth - 1, TDs.item(i).innerHTML),
                            d2 = new Date();

                        if (this.isSame(d1, d2)) {
                            TDs.item(i).className = 'onToday';
                        } else {
                            TDs.item(i).className = '';
                        }
                    }

                    // 获取今日
                    if (this.isSame(new Date(this.cYear, this.cMonth - 1, day), new Date())) {
                        evt.target.className = 'onToday onSelect';
                    } else {
                        evt.target.className = 'onSelect';
                    }

                    this.selectDay = day;
                    this.selectWeek = this.getDay(day);

                }

                return false;
            }
        });
    };

    Datepicker.prototype = {
    	initialize: function(options) {
    		this.setOptions(options);
    	},
    	setOptions: function(options) {

    		this.options = {
    			isToday: true,
    			format: 'yyyy-mm-dd',
    			startDate: null,
    			endDate: null,
    			selectDate: null,
    			min: null,
    			max: null
    		};

    		extend(this.options, options || {});
    	},
    	render: function() {},
    };

    Datepicker.getInstance = function() {

        // this 即指向调用当前 Datepicker 构造函数；
        var instance = new this();

        // 如果对 initialize 有定义
        if (instance.initialize) {
            instance.initialize.apply(instance, arguments);
        }

        return instance;
    }

    _root.Datepicker = Datepicker;

})(Calendar);

/**
 * JS日历控件
 * @author  yuqigong
 * @date 2016-8-2
 */

// 基本使用
// var cal = Calendar.getInstance();

// 可以指定容器
// var cal = Calendar.getInstance({
//     id: 'cal'
// });

// 重写 onSelect 事件
// var cal = Calendar.getInstance({
//     id: 'cal',
//     onSelect: function(evt, elem) {

//         if (evt.target && evt.target.nodeName.toUpperCase() === 'TD') {

//             var TDs = elem.getElementsByTagName('td'),
//                 day = +evt.target.innerHTML;

//             for (var i = 0; i < TDs.length; i++) {
//                 var d1 = new Date(this.cYear, this.cMonth - 1, TDs.item(i).innerHTML),
//                     d2 = new Date();

//                 if (this.isSame(d1, d2)) {
//                     TDs.item(i).className = 'onToday';
//                 } else {
//                     TDs.item(i).className = '';
//                 }
//             }

//             // 获取今日
//             if (this.isSame(new Date(this.cYear, this.cMonth - 1, day), new Date())) {
//                 evt.target.className = 'onToday onSelect';
//             } else {
//                 evt.target.className = 'onSelect';
//             }

//             this.selectDay = day;

//         }

//         return false;
//     }
// });

(function() {

    var _root = this;

    function $(id) {
        return 'string' == typeof id ? document.getElementById(id) : id;
    }

    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }

        return this;
    }

    function insertAfter(newEl, targetEl) {
        var parentEl = targetEl.parentNode;

        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    }

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }

    var Calendar = function() {

        this.fn = {};

        // 判断是否同一日
        this.isSame = function(d1, d2) {
            return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
        };

        // 相差天数
        this.interval = function(t1, t2) {
            return Math.floor((t1.getTime() - t2.getTime()) / 86400000);
        };

        // 是否为今天
        this.isToday = function(day) {
            return day ? this.isSame(day, new Date()) : void 0;
        };

        // 是否为开始时间
        this.isStart = function(day) {
            var start = this.options.startDate ? new Date(this.options.startDate) : new Date();
            return day ? this.isSame(day, start) : void 0;
        };

        // 是否为结束时间
        this.isEnd = function(day) {
            var end = this.options.startDate ? new Date(this.options.endDate) : new Date();
            return day ? this.isSame(day, end) : void 0;
        };

        // 是否有效
        this.isEffect = function(day) {

            // 开始时间默认今天
            var start = this.options.startDate ? new Date(this.options.startDate) : new Date(),
                end = this.options.endDate ? new Date(this.options.endDate) : day;

            // 大于开始时间，小于结束时间，有效
            if (this.interval(day, start) <= -1 || this.interval(day, end) > 0) {
                return false;
            }

            return true;
        };

    };

    Calendar.prototype = {
        initialize: function(options) {
            this.setOptions(options);
            // this.importStyle();

            this.cYear = this.options.Year;
            this.cMonth = this.options.Month;
            this.cDay = this.options.Day;
            this.cWeek = this.options.Week;
            this.selectDay = '';
            this.selectWeek = '';
            this.render();
        },
        /**
         * [importStyle 导入样式]
         * @return {[type]} [description]
         */
        importStyle: function() {
            var style = document.createElement('style');

            style.type = 'text/css';
            style.innerHTML = this.options.Style;

            insertAfter(style, document.getElementsByTagName('title')[0]);
        },
        setOptions: function(options) {
            // 默认值
            this.options = {
                Year: new Date().getFullYear(),
                Month: new Date().getMonth() + 1,
                Day: new Date().getDate(),
                Week: new Date().getDay(),
                today: true,
                Style: '.Calendar{font-family:Verdana;font-size:12px;text-align:center;width:200px;height:auto;padding:20px 8px 8px;line-height:1.5;margin:0;border:1px solid #d6d6d6;overflow:hidden}.Calendar a{color:#000;text-decoration:none}.Calendar table{width:100%;border:0}.Calendar table th,.Calendar table td{font-size:11px;text-align:center;padding:5px;color:#333}.CalPrev{cursor:pointer;float:left;padding-left:5px}.CalNext{cursor:pointer;float:right;padding-right:5px}.Calendar td.onToday{color:#f00;font-weight:bold}.Calendar td.onSelect{background:#ecebeb}'
            };

            // 设置开始时间
            if (options.startDate) {
                var start = new Date(options.startDate);

                this.options.Year = start.getFullYear();
                this.options.Month = start.getMonth() + 1;
                this.options.Day = start.getDate();
                this.options.Week = start.getDay();
            }

            extend(this.options, options || {});
        },
        // 每月天数
        getMonthDays: function() {
            var days = [];
            // 当月最后一天的日期值,作为当月的天数
            for (var i = 1, monthDay = new Date(this.cYear, this.cMonth, 0).getDate(); i <= monthDay; i++) {
                days.push(new Date(this.cYear, this.cMonth - 1, i));
            }

            return days;
        },
        // 视图天数
        getViewDates: function() {

            // 保存日期列表
            var dates = [];

            // 当月第一天的日期值, 作为当月距离第一天的天数
            for (var i = 1, firstDay = new Date(this.cYear, this.cMonth - 1, 1).getDay(); i <= firstDay; i++) {
                dates.push(null);
            }

            var monthDays = this.getMonthDays().slice();

            while (monthDays.length > 0) {
                dates.push(monthDays.shift());
            }

            return dates;
        },
        /**
         * [defaultCalendar 默认日历]
         * @return {[type]} [description]
         */
        defaultCalendar: function() {

            function createElementsObject() {

                var options = {
                    type: '',
                    cname: '',
                    contxt: '',
                    evtType: '',
                    event: null
                };

                extend(options, arguments[0] || {});

                var el = document.createElement(options.type);

                if (options.cname) el.className = options.cname;
                if (options.contxt) el.innerHTML = options.contxt;
                if (options.event) addEvent(el, options.evtType, options.event);

                return el;
            }

            var that = this,
                Cal = createElementsObject({
                    type: 'div',
                    cname: 'Calendar'
                }),
                btnPrev = createElementsObject({
                    type: 'div',
                    cname: 'CalPrev',
                    contxt: '&lt;&lt;',
                    evtType: 'click',
                    event: function(evt) {
                        that.preMonth();
                    }
                }),
                btnNext = createElementsObject({
                    type: 'div',
                    cname: 'CalNext',
                    contxt: '&gt;&gt;',
                    evtType: 'click',
                    event: function(evt) {
                        that.nextMonth();
                    }
                }),
                calYear = createElementsObject({
                    type: 'span',
                    cname: 'idCalYear',
                    contxt: that.cYear + '年'
                }),
                calMonth = createElementsObject({
                    type: 'span',
                    cname: 'idCalMonth',
                    contxt: that.cMonth + '月'
                }),
                calDates = createElementsObject({
                    type: 'table',
                    evtType: 'click',
                    event: function(evt) {

                        // onSelect 回调
                        if (that.options.onSelect && !that.options.onSelect.call(that, evt, this)) return;

                    }
                });

            // week
            var week = ['日', '一', '二', '三', '四', '五', '六'];

            while (week.length > 0) {
                var row = document.createElement('tr');
                for (var i = 1; i <= 7; i++) {
                    var th = document.createElement('th');
                    th.innerHTML = week.shift();
                    row.appendChild(th);
                }
                calDates.appendChild(row);
            }

            // days
            var tmpDays = this.getViewDates().slice();

            var isRange = this.options && this.options.range ? true : false;

            while (tmpDays.length > 0) {
                var row = document.createElement('tr');

                for (var i = 1; i <= 7; i++) {
                    var cell = document.createElement('td');
                    cell.innerHTML = '';

                    if (tmpDays.length > 0) {
                        var d = tmpDays.shift();
                        cell.innerHTML = d ? d.getDate() : '';

                        if (d && !this.isEffect(d)) {
                            // 开始日期
                            if (d && this.isSame(d, new Date(this.options.startDate))) {
                                cell.className = 'onStart invalid';
                            }
                            // 结束日期
                            else if (d && this.isSame(d, new Date(this.options.endDate))) {
                                cell.className = 'onEnd invalid';
                            }
                            // 获取今日
                            else if (this.options.today && d && this.isToday(d)) {
                                cell.className = 'onToday invalid';
                            }
                            // 默认无效
                            else {
                                cell.className = 'invalid';
                            }
                        } else {
                            // 开始日期
                            if (d && this.isSame(d, new Date(this.options.startDate))) {
                                cell.className = 'onStart';
                            }
                            // 结束日期
                            if (d && this.isSame(d, new Date(this.options.endDate))) {
                                cell.className = 'onEnd';
                            }
                            // 获取今日
                            if (this.options.today && d && this.isToday(d)) {
                                cell.className = 'onToday';
                            }
                        }
                    }

                    row.appendChild(cell);
                }

                calDates.appendChild(row);
            }

            Cal.appendChild(btnPrev);
            Cal.appendChild(btnNext);
            Cal.appendChild(calYear);
            Cal.appendChild(calMonth);
            Cal.appendChild(calDates);

            var targetElem = this.options.id ? $(this.options.id) : document.getElementsByTagName('body')[0];

            while (targetElem.hasChildNodes()) {
                targetElem.removeChild(targetElem.firstChild);
            }

            targetElem.appendChild(Cal);
        },
        /**
         * [preMonth 上一个月]
         * @return {[type]} [description]
         */
        preMonth: function() {
            // 取得上月日期对象
            var d = new Date(this.cYear, this.cMonth - 2, 1);
            // 设置属性
            this.cYear = d.getFullYear();
            this.cMonth = d.getMonth() + 1;
            // 重绘日历
            this.render();
        },
        /**
         * [nextMonth 下一个月]
         * @return {[type]} [description]
         */
        nextMonth: function() {
            // 取得下月日期对象
            var d = new Date(this.cYear, this.cMonth, 1);
            // 设置属性
            this.cYear = d.getFullYear();
            this.cMonth = d.getMonth() + 1;
            // 重绘日历
            this.render();
        },
        render: function() {
            this.getViewDates();

            if (!this.options.templateId) {
                return this.defaultCalendar();
            }

            this.fn.$ = $;
            this.fn.addEvent = addEvent;

            // 渲染页面
            this.options.render && this.options.render.call(this);
            // 绑定事件
            this.options.bindEvent && this.options.bindEvent.call(this);
        }
    };

    Calendar.getInstance = function() {

        // this 即指向调用当前 Calendar 构造函数；
        var instance = new this();

        // 如果对 initialize 有定义
        if (instance.initialize) {
            instance.initialize.apply(instance, arguments);
        }

        return instance;
    }

    _root.Calendar = Calendar;

})();

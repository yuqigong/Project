/**
 * [gNumber 基于Zepto，累加或累减]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($) {
    var defaults = {
        minusClass: '.minus',
        plusClass: '.plus',
        inputClass: '.input',
        speed: 1,
        initValue: 1
    };

    $.fn.gNumber = function(options) {
        var settings = $.extend({}, defaults, options);

        return this.each(function() {
            var self = $(this);

            var btnMinus = self.children(settings.minusClass),
                btnPlus = self.children(settings.plusClass),
                inpNumber = self.children(settings.inputClass),
                iSpeed = parseInt(settings.speed),
                iVal = parseInt(settings.initValue);

            // 设置初始值
            inpNumber.val(iVal);

            btnPlus.on('click', function() {
                var valInit = $.trim(inpNumber.val()),
                    reVal;

                reVal = parseInt(valInit) + iSpeed;
                inpNumber.val(reVal);
            });

            btnMinus.on('click', function() {
                var valInit = $.trim(inpNumber.val()),
                    reVal;

                reVal = parseInt(valInit) - iSpeed;
                inpNumber.val(reVal);
            });
        });
    };
})(Zepto);

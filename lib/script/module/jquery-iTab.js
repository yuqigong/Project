(function($, window) {
    var defaults = {
        title: '.nav',
        target: '.list'
    };

    $.fn.iTab = function(optisons) {
        var opts = $.extend({}, defaults , optisons || {});

        return this.each(function(){
            var self = $(this);
        });
    };
})(jQuery, window);

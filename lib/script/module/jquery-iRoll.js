(function($) {
    var iRoll = $('#iRoll'),
        arrowLeft = iRoll.children('.roll-left'),
        arrowRight = iRoll.children('.roll-right'),
        rollGallery = iRoll.children('.roll-gallery'),
        operator = '',
        speed = 300;

    arrowRight.on('click', function() {
        operator = '-=';
        console.log(reWidth());
        fnRoll(operator);
    });
    arrowLeft.on('click', function() {
        operator = '+=';
        fnRoll(operator);
    });

    var fnRoll = function(operator) {
        rollGallery.animate({
            marginLeft: operator + speed
        }, 'slow');
    }
    var reWidth = function() {
        var iSpeed = rollGallery.css('margin-left'),
            iEnd = iSpeed.indexOf('px');
        iSpeed = iSpeed.substr(0, iEnd);
        return Math.abs(iSpeed);
    }
})(jQuery);

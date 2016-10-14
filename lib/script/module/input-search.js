$(function() {
    var oInput = $('#j_search .search-input'),
        oBtn = $('#j_search .search-btn'),
        oResults = $('#j_search .search-res');

    var dataUrl = 'http://train.qunar.com/qunar/chezhanSuggest.jsp?';
    // http://train.qunar.com/qunar/chezhanSuggest.jsp?lang=zh&q=h&sa=true&format=json&callback=XQScript_14
    var data = {
        lang: 'zh',
        // q: 'h',
        sa: true,
        format: 'js',
        callback: 'XQScript_14'
    };

    oBtn.on('click', function() {
        var str = $.trim(oInput.val());
        if (str === '') {
            console.log('##input is null');
            return;
        }
        console.log('##event is click');
        console.log('##input is ' + str);
        data.q = str;
        func(data);
    });

    oInput.on('input', function() {
        var str = $(this).val();
        if (str === '') {
            console.log('##input is null');
            return;
        }
        console.log('##event is input');
        console.log('##input is ' + str);
        data.q = str;
        func(data);
    });

    oInput.on('blur', function() {
        console.log('##event is blur');
        oResults.empty();
    });

    oInput.on('focus', function() {
        console.log('##event is focus');
        var str = $(this).val();
        if (str === '') {
            console.log('##input is null');
            return;
        }
        data.q = str;
        func(data);
    });

    oInput.on('cut', function() {
        console.log('##event is cut');
    });

    oInput.on('copy', function() {
        console.log('##event is copy');
    });

    oInput.on('paste', function() {
        console.log('##event is paste');
    });

    var func = function(data) {
        $.ajax({
            type: 'GET',
            url: dataUrl,
            data: data,
            dataType: 'jsonp',
            success: function(res) {
                // console.log(res);
                // console.log(JSON.stringify(res));
                var ds = res,
                    dsr = ds.result,
                    userInput = ds.userInput;

                var cityName = '',
                    htmList = '';

                htmList += '<ul>';
                for (var i = 0; i < dsr.length; i++) {
                    cityName = dsr[i].display;
                    cityName = cityName.replace(userInput, '<span>'+ userInput +'</span>');
                    htmList += '<li>' + cityName + '</li>';
                }
                htmList += '<ul>';

                oInput.after(oResults.html(htmList))
                    .parent()
                    .addClass('r');
            }
        });
    };
});

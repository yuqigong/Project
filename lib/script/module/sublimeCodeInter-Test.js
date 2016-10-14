function extend(C, P) {
    var F = function() {};　　　　
    F.prototype = P.prototype;　　　　
    C.prototype = new F();　　　　
    C.uber = P.prototype;
    C.prototype.constructor = C;　
}

function multiExtend() {
    var Class = function() {};
    for (var i = 0; i < arguments.length; i++) {
        var base = new arguments[i]();
        for (var j in base) {
            Class.prototype[j] = base[j];
        }
    };
    return Class;
}

var inherit = (function() {
    var F = function() {};
    return function(C, P) {
        F.prototype = P.prototype;
        C.prototype = new F();
        C.uber = P.prototype;
        C.prototype.constructor = C;
    }
}());

function Human(str) {
    this.species = '人类';
}

function Lern(lang) {
    var language = [{
        'lang': 'CN',
        'say': '我学会中文了！'
    }, {
        'lang': 'EN',
        'say': 'I learn English!'
    }, {
        'lang': 'JA',
        'say': '私は日本语をマスターしました!'
    }];
    var len = language.length;

    do {
        if (lang == language[len]['lang']) {
            return language[len]['say'];
        }
        len--;
    } while (len > 0);
}

function Say(str) {
    console.log(str);
}

// var Chinese = function() {
//     this.name = '中国人';
//     this.language = 'CN';
//     this.second_language = '';
// };
// var British = function() {
//     this.name = 'British';
//     this.language = 'EN';
//     this.second_language = '';
// };
// var Japanese = function() {
//     this.name = '日本人';
//     this.language = 'JA';
//     this.second_language = '';
// };

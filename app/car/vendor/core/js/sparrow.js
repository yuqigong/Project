/**
 * author: Richie
 * Version: 0.1.0
 * Date: 2016-6-23
 */
// Although the house sparrow is small, but be fully equipped.
(function() {

    var
        root = this,
        configs = {},
        store = {};

    var
        version = '0.1.0';

    var $ = {

        extend: function(deep, target, options) {

            for (name in options) {

                copy = options[name];

                if (deep && typeof copy === 'object') {
                    // fix null
                    target[name] = copy ? ((copy.constructor === Array) ? [] : {}) : copy;
                    $.extend(deep, target[name], copy);

                } else {

                    target[name] = options[name];

                }

            }

            return target;

        },

        template: function(html, options) {

            if (!html || !options) return;

            var re = /<%([^%>]+)?%>/g,
                reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                code = 'var r=[];\n',
                cursor = 0,
                match;

            var add = function(line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            }

            while (match = re.exec(html)) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }

            add(html.substr(cursor, html.length - cursor));
            code += 'return r.join("");';
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);

        }

    };

    var Router = {
        routes: [],
        mode: null,
        root: '/',
        config: function(options) {
            this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
            this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
            return this;
        },
        getFragment: function() {
            var fragment = '';
            if (this.mode === 'history') {
                fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
                fragment = fragment.replace(/\?(.*)$/, '');
                fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return this.clearSlashes(fragment);
        },
        clearSlashes: function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        add: function(re, handler) {
            if (typeof re == 'function') {
                handler = re;
                re = '';
            }
            this.routes.push({ re: re, handler: handler });
            return this;
        },
        remove: function(param) {
            for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
                if (r.handler === param || r.re.toString() === param.toString()) {
                    this.routes.splice(i, 1);
                    console.log('remove:', param);
                    return this;
                }
            }
            return this;
        },
        flush: function() {
            this.routes = [];
            this.mode = null;
            this.root = '/';
            return this;
        },
        check: function(f) {
            var fragment = f || this.getFragment();
            for (var i = 0; i < this.routes.length; i++) {
                var match = fragment.match(this.routes[i].re);
                if (match) {
                    match.shift();
                    this.routes[i].handler.apply({}, match);
                    return this;
                }
            }
            return this;
        },
        listen: function() {
            var self = this;
            var current = self.getFragment();
            var fn = function() {
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            }
            clearInterval(this.interval);
            this.interval = setInterval(fn, 50);
            return this;
        },
        navigate: function(path) {
            path = path ? path : '';
            if (this.mode === 'history') {
                history.pushState(null, null, this.root + this.clearSlashes(path));
            } else {
                window.location.href.match(/#(.*)$/);
                window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
            }
            return this;
        }
    }

    var Sparrow = $.extend(true, {}, Router);

    Sparrow.version = version;
    Sparrow.$ = $;

    root.Sparrow = Sparrow;

}.call(this));

/**
 * author: Richie
 * Version: 0.1.0
 * Date: 2015-12-16
 */
(function($) {

    var root = this;

    var configs = {}, store = {};

    configs.spaId = '';

    configs.views = [];

    var isEmpty = function(obj) {

        if (obj == null) return true;

        var toString = Object.prototype.toString.call(obj);
        if (toString === '[object Array]' || toString === '[object String]') {
            return obj.length === 0;
        }

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }

        return true;
    };

    var ViewMethods = {
        hide: function() {
            console.log('This has yet to be completed ~');
        },
        load: function() {

            var index = $.inArray(this, configs.views);

            $(this).show();
            $(this).css('top', '0');
            document.getElementById('j_spa').style.webkitTransform = 'translate3d(0, 0, 0)';

            $.each(configs.views, function(i) {
                if (i !== index) {
                    $(this).hide();
                }
            });

        },
        reset: function() {
            console.log('This has yet to be completed ~');
        }
    };

    var Router = function() {

        this.getStore = function() {
            return isEmpty(store) ? null : store;
        };

        this.setStore = function(path, viewId, templateId, controller) {
            store[path] = {
                viewId: viewId,
                templateId: templateId,
                controller: controller
            };
        };

        this.execute = function() {

            var handler = function() {

                var view = null,
                    obj = {},
                    url = location.hash.slice(1) || '/',
                    route = store[url];

                view = view || document.getElementById(route.viewId);
                if (view && route.controller) {
                    obj.load = ViewMethods.load.bind(view);
                    obj.view = $(view);

                    new route.controller(obj, configs);
                }
            };

            window.addEventListener('hashchange', handler);

            window.addEventListener('load', handler);

        };
    };

    // 实例化 Router
    var router = new Router();

    var Spa = function() {

        this.getStore = router.getStore;

        var eventManager = {},
            pageRender = {};

        eventManager.router = router.execute;

        var anything = null;

        var onBeforeWithCreate = function() {
            if (anything && typeof anything === 'function') {
                anything();
            }
        };

        var onAfterWithCreate = function() {
        };

        pageRender.init = function() {

            if (configs && !configs.spaId) {
                return console.error('Missing spaId');
            }

            configs.spa = $('#' + configs.spaId);

            configs.views = configs.spa.find('.' + configs.subClassName);

            // 页面加载中
            configs.loading = $('#loading');

            // 取出 ID
            var ids = $.map(store, function(i) {
                return i.viewId;
            });

            $.each(configs.views, function(index) {
                // 添加 Id
                $(this).attr('id', ids[index]);

                if (index !== 0) {
                    $(this).hide();
                    $(this).css('top', '100%');
                }
            });

        };

        this.config = function(option) {
            configs = option;
        };

        this.exports = function(things) {
            anything = things;
        };

        this.onCreate = function() {
            onBeforeWithCreate();
            pageRender.init();
            eventManager.router();
            onAfterWithCreate();
        };

        this.onComplete = function() {
        };

    };

    Spa.prototype = {
        add: function(path, viewId, templateId, controller) {
            router.setStore(path, viewId, templateId, controller);
        },
        run: function() {
            this.onCreate();
            this.onComplete();
        },
        hide: function() {
            configs.loading.show();
            configs.spa.removeClass('show').addClass('hide');
        },
        show: function() {
            configs.loading.hide();
            configs.spa.removeClass('hide').addClass('show');
        },
        import: function(things) {
            this.exports(things);
        }
    };

    root.Spa = Spa;

}.call(this, Zepto));

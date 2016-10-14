(function () {
    var $ = function (selector) {
            var els = document.querySelectorAll(selector);
            if (!els.length) return null;
            if (els.length === 1) return els[0];
            return Array.prototype.slice.call(els, 0);
        },

        Ajax = function (options) {
            var request = new XMLHttpRequest();
            request.open(options.method || 'GET', options.url, !(options.async === false));
            if (options.requestHeader) {
                Object.keys(options.requestHeader).forEach(function (header) {
                    request.setRequestHeader(header, options.requestHeader[header]);
                });
            }
            options.contentType === 'application/json' && request.setRequestHeader('Content-Type', 'application/json');
            request.onload = function (e) {
                if (request.status >= 200 && request.status < 400) {
                    (options.callback || console.log.bind(console))(request.responseText);
                }
                else {
                    (options.error || console.log.bind(console))(request);
                }
            };
            request.onerror = function (e) {
                console.log('Ajax: connection error!');
            };
            typeof options.beforeSend === 'function' && options.beforeSend(request);
            request.send(options.data || null);
        },

        getParams = function () {
            var params = {},
                paramsString = window.location.search.substring(1),
                paramPairs = paramsString.split('&');

            paramPairs.forEach(function (pair, i) {
                if (i === 0) pair = atob(pair);
                pair = pair.split('=');
                if (!pair[0] || typeof pair[1] === 'undefined') return;
                params[pair[0]] = pair[1];
            });

            return params;
        },

        setElementsAttributes = function (data) {
            var map = {
                headPic: data.feed.creatorHeadPic,
                nickName: data.feed.creatorNickName,
                babyBirthday: data.feed.babyBirthday,
                babyGender: data.feed.babyGender,
                imgUrl: data.feed.imageUrl,
                city: data.feed.city,
                sincePostTime: ((Date.now() - data.feed.createDate) / (1000 * 60)).toFixed(), //minutes
                description: data.feed.content,
                likersCount: data.likers.length,
                likersHeadPics: []
            };

            data.likers.forEach(function (liker) {
                map.likersHeadPics.push(liker.headPic);
            });

            $('#headPic').setAttribute('src', map.headPic);
            $('#nickName').innerHTML = map.nickName;
            var birthday = new Date(map.babyBirthday),
                current = new Date(),
                dYear = current.getFullYear() - birthday.getFullYear(),
                dMonth = current.getMonth() - birthday.getMonth(),
                year, month, ageString = '';
            year = dMonth < 0 ? dYear - 1 : dYear;
            month = dMonth < 0 ? 12 + dMonth : dMonth;
            if (!year) {
                ageString += ((month || 1) + '个月');
            }
            else {
                ageString += (year + '岁');
                if (month) ageString += ('零' + month + '个月');
            }
            if (current < birthday) {
                ageString = '预产期' + ((-dYear * 12) - dMonth) + '个月';
            }
            $('#age').innerHTML = ageString;
            var $feed = $('#img-feed');
            $feed.setAttribute('src', map.imgUrl);
            $feed.style.maxWidth = window.innerWidth + 'px';
            $feed.style.maxHeight = window.innerHeight * 0.7 + 'px';
            $('#city').innerHTML = map.city || '';
            if (map.sincePostTime < 60) {
                $('#since-post-time').innerHTML = map.sincePostTime + '分钟';
            }
            else if (map.sincePostTime < 60 * 24) {
                $('#since-post-time').innerHTML = (map.sincePostTime / 60).toFixed() + '小时' + (map.sincePostTime % 60) + '分钟';
            }
            else if (map.sincePostTime < 60 * 24 * 30) {
                $('#since-post-time').innerHTML = (map.sincePostTime / (60 * 24)).toFixed() + '天';
            }
            else if (map.sincePostTime < 60 * 24 * 30 * 12) {
                $('#since-post-time').innerHTML = (map.sincePostTime / (60 * 24 * 30)).toFixed() + '个月';
            }
            else {
                $('#since-post-time').innerHTML = (map.sincePostTime / (60 * 24 * 30 * 12)).toFixed() + '年';
            }
            $('#description').innerHTML = map.description || '';
            $('#likers-num').innerHTML = map.likersCount;
            $('.fav .img-round').forEach(function (el, i) {
                if (i < map.likersHeadPics.length) {
                    el.setAttribute('src', map.likersHeadPics[i]);
                }
                else {
                    el.parentNode.parentNode.remove();
                }
            });

            if (!map.likersCount) {
                $('.fav').remove();
            }
        };

    var params = getParams();

    Ajax({
        url: 'http://api.xiaobudian.me/childhood/api/feeds/' + params.feedId,
        callback: function (responseText) {
            setElementsAttributes(JSON.parse(responseText).data);
        }
    });

    document.addEventListener('click', function (e) {
        window.location.href = 'http://www.xiaobudian.me';
    });

    //Ajax({
    //    url: 'http://api.xiaobudian.me/childhood/api/admin/app/download/urls',
    //    callback: function (responseText) {
    //        var downloadUrl = {},
    //            data = JSON.parse(responseText).data;

    //        downloadUrl.appStore = data.AppleMarketPlace;

    //        if (/iPhone|iPad/i.test(navigator.userAgent)) {
    //            document.addEventListener('click', function (e) {
    //                //window.location.href = downloadUrl.appStore;
    //                window.location.href = 'http://www.pgyer.com/MPEA';
    //            });
    //        }
    //    }
    //});
})();

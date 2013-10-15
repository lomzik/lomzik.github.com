(function (root) {
    root.L = root.L || {};
    var l = root.L;

    l.log = function (obj) {
        if ('console' in window && 'log' in console) {
            console.log(obj);
        }
    };

    l.init = function () {
        l.getJq();
        l.getCss();
    };

    l.jQ_cb = function () {
        l.initBot();
    };

    l.getJq = function () {
        var head = document.getElementsByTagName('head')[0];
        var jq = document.createElement('script');
        jq.type = 'text/javascript';
        jq.async = true;
        jq.onload = function () {
            l.log('jQuery loaded.');
            l.jQ_cb();
        };
        jq.src = "http://code.jquery.com/jquery-1.10.2.min.js";
        head.appendChild(jq);
    };

    l.getCss = function () {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = 'botCss';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://lomzik.github.io/bot/bot.css';
        link.media = 'all';
        head.appendChild(link);
    };

    l.initBot = function () {
        if (l.xG = document.getElementById('iframe_content').contentWindow) {
            l.Bot = {
                version: 'version: 0.0.1',
                state: 0,
                message: ''
            };
            l.log(l.Bot);
        } else {
            l.log('Frame not found.');
        }

    };
})(window);
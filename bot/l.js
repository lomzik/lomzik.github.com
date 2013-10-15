(function (root) {
    root.L = root.L || {};
    var l = root.L;

    l.bot = {
        version: 'version: 0.0.1',
        state: 0,
        message: ''
    };

    l.log = function (obj) {
        if ('console' in window && 'log' in console) {
            console.log(obj);
        }
    };

    l.init = function () {
        l.getJq();
//        l.xG = document.getElementById('iframe_content').contentWindow;
    };

    l.jQ_cb = function () {
        return;
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
})(window);
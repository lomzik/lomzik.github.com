(function (root) {
    root.L = root.L || {};
    var l = root.L,
        LinkLength,
        _QS;

    l.init = function () {
        root.console.log('Start');

        LinkLength = $('#t_map select option')['length'];

        _QS = l.parseQS(root.location.search.substring(1));

    };

    // parse URL
    l.parseQS = function(q) {
        return (function(a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=');
                if (p.length != 2) continue;
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        })(q.split("&"));
    };

})(window);

(function (root) {
    root.L = root.L || {};
    var l = root.L,
        LinkLength,
        _url;

    l.init = function () {
        root.console.log('Start');

        LinkLength = $('#t_map select option')['length'];

        _url = l.parseURL(root.location.href);

    };

    // parse URL
    l.parseURL = function (str) {
        var url = document.createElement('a');
        url.href = str;
        return url;
    }

})(window);

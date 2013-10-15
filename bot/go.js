(function (window) {
    var head = document.getElementsByTagName('head')[0];
    var jq = document.createElement('script');
    jq.type = 'text/javascript';
    jq.async = true;
    jq.onload = function () {
        window.L.init();
    };
    jq.src = "http://lomzik.github.io/bot/l.js";
    head.appendChild(jq);
})(window);
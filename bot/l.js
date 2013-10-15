(function (root) {
    root.L = root.L || {};
    var l = root.L;

    l._T = {};

    l.log = function (obj) {
        if ('console' in root && 'log' in console) {
            root.console.log(obj);
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
        var xG;
        if (xG = document.getElementById('iframe_content')) {
            l.xG = xG.contentWindow;

            l.setBot();
            l.setPlayer();

            l.log(l.Bot.version);

            l.createPanel();

            l.setHealth();
        } else {
            l.log('Frame not found.');
        }
    };

    l.setBot = function () {
        l.Bot = {
            version: 'version: 0.0.1',
            state: 0,
            message: ''
        };
    };

    l.setPlayer = function () {
        l.Player = {
            death: 0,
            health: {
                min: 0,
                max: 0
            },
            ability: {
                usedInd: -1,
                used: -1
            }
        };
    };

    l.createPanel = function () {
        var html = "<div><span class='lBotAction' data-state='1'>Start</span>&nbsp;<span class='lBotAction' data-state='0'>Stop</span></div>";
        $("body").append("<div id='lBotPanel'></div>");
        $("#botPanel").html(html);
    };

    l.setHealth = function () {
        if ('health' in l._T) {
            clearTimeout(l._T.health);
            delete l._T.health;
        }
        l._T.health = setInterval(function () {
            var health = l.xG.$('.bar-holder.helth .number').text().split('/');
            l.Player.health.min = +health[0];
            l.Player.health.max = +health[1];
        }, 12);
    };

    l.loop = function () {
        if (l.Bot.state === 1) {
            var loopTimer = setInterval(function () {

                var jqmClose = l.xG.$('.jqmClose');
                jqmClose.click();

                if (l.Bot.state === 0) {
                    clearTimeout(loopTimer);
                    l.log('Bot state = 0. Loop off.');
                }

                if (l.Bot.state === 1) {
                    l.log('Player health: ' + l.Player.health.min);
                    if (l.Player.health.min > l.Player.health.max * .9) {
                        clearTimeout(loopTimer);
                    }
                }

            }, 10000);
        }
    }

})(window);
(function (root) {
    root.L = root.L || {};
    var l = root.L;

    l._T = {battle: {}};

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
//        jq.src = "http://code.jquery.com/jquery-1.11.0.min.js";
        jq.src = "http://code.jquery.com/jquery-2.1.0.min.js";
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
            l.setPTimers();
            l.setCloser();
        } else {
            l.log('Frame not found.');
        }
    };

    l.setBot = function () {
        l.Bot = {
            version: 'Bot version: 0.0.1',
            state: 0,
            message: ''
        };
    };

    l.setPlayer = function () {
        l.Player = {
            death: 0,
            timers: {
                location: '0:00',
                mob: '0:00',
                attack: '0:00'
            },
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
        $("#lBotPanel").html(html);

        $("#lBotPanel").on('click', '.lBotAction', function (e) {
            e.preventDefault();
            l.Bot.state = e.target.data('state') << 0;

            l.loop();
        });
    };

    l.setCloser = function () {
        l.killTimer('closer');
        l._T.health = setInterval(function () {
            var jqmWindow = l.xG.$('.jqmWindow');

            jqmWindow.find('a.button.jqmClose').trigger('click');

        }, 12);
    };

    l.setHealth = function () {
        l.killTimer('health');
        l._T.health = setInterval(function () {
            var health = l.xG.$('.bar-holder.helth .number').text().split('/');
            l.Player.health.min = +health[0];
            l.Player.health.max = +health[1];
        }, 12);
    };

    l.setPTimers = function () {
        l.killTimer('pTimers');
        l._T.pTimers = setInterval(function () {
            l.Player.timers.location = l.xG.$('.char-holder .timers .location').text();
            l.Player.timers.mob = l.xG.$('.char-holder .timers .mob').text();
            l.Player.timers.attack = l.xG.$('.char-holder .timers .atack').text();
        }, 12);
    };

    l.killTimer = function (timer) {
        if (timer in l._T.battle) {
            clearTimeout(l._T.battle[timer]);
            delete l._T.battle[timer];
        }
    };

    l.killTimers = function () {
        for (var timer in l._T.battle) {
            l.killTimer(l._T.battle[timer]);
        }
    };

    l.clickToMob = function () {
        var mobs = l.xG.$('.attack-holder .attack-item .attack-block'),
            mob,
            mobId;
        if (mobs.length > 0) {
            mob = $(mobs[(Math.floor(Math.random() * mobs.length))]);
            mobId = mob.siblings('.btn-attack').data('mobid');
            mob.trigger('click');
            l.log('Attack mob (' + mobId + ')...');
        }
    };

    l.lookingMob = function () {
        l.killTimer('lookingMobTimer');
        l._T.battle.lookingMobTimer = setInterval(function () {
            var _p = l.xG.$('.iframebattle-content .protection'),
                _abl = _p.find('li.ability'),
                _btn = _p.find('a.go-btn'),
                cur_abl;

            if (_p.length > 0) {
                l.killTimer('lookingMobTimer');

                function attack() {
                    var av_abl = _abl.find('.ability').not('.inactive');

                    av_abl.each(function () {
                        var s = $(this);
                        if (s.data('ability') !== cur_abl) {
                            s.trigger('click');
                            return false;
                        }
                    });

                    _btn.trigger('click');

                };

                l._T.battle.attackMob = setInterval(attack, 12);
            }

        }, 12);
    };

    l.loop = function () {
        l.killTimers();
        if (l.Bot.state === 1) {
            l._T.battle.loopTimer = setInterval(function () {

                var jqmClose = l.xG.$('.jqmClose');
                jqmClose.click();

                if (l.Bot.state === 0) {
                    l.killTimer('loopTimer');
                    l.log('Bot state = 0. Loop off.');
                }

                if (l.Bot.state === 1) {
                    l.log('Player health: ' + l.Player.health.min);
                    if (l.Player.health.min > l.Player.health.max * .9 && l.Player.timers.mob == '0:00' && l.Player.timers.attack == '0:00') {
                        l.killTimer('loopTimer');

                        // Клик на кнопку бой
                        ( new l.xG.Tg.Loader() ).block('/game/locations/claims/', l.xG.$('.game-locations'), function () {
                            l.log('В бой');
                            l.clickToMob();
                        });
                    }
                }

            }, 10000);
        }
    }

})(window);

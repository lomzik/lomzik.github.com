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
            l.Bot.state = $(e.target).data('state') << 0;

            if (l.Bot.state === 0) {
                l.killTimers();
                l.log('Bot state = 0. Loop off.');
            } else {
                l.log('Bot state = 1. Looping.');
                l.loop();
            }

        });
    };

    l.setCloser = function () {
        clearTimeout(l._T['closer']);
        delete l._T['closer'];
        l._T.closer = setInterval(function () {
            var jqmWindow = l.xG.$('.jqmWindow');

            if (jqmWindow.length > 0) {
                jqmWindow.find('a.button.jqmClose').trigger('click');
                l.log('close window');
//                l.loop();
            }
        }, 50);
    };

    l.setHealth = function () {
        clearTimeout(l._T['health']);
        delete l._T['health'];
        l._T.health = setInterval(function () {
            var health = l.xG.$('.bar-holder.helth .number').text().split('/');
            l.Player.health.min = +health[0];
            l.Player.health.max = +health[1];
        }, 100);
    };

    l.setPTimers = function () {
        clearTimeout(l._T['pTimers']);
        delete l._T['pTimers'];
        l._T.pTimers = setInterval(function () {
            l.Player.timers.location = l.xG.$('.char-holder .timers .location').text();
            l.Player.timers.mob = l.xG.$('.char-holder .timers .mob').text();
            l.Player.timers.attack = l.xG.$('.char-holder .timers .atack').text();
        }, 100);
    };

    l.killTimer = function (timer) {
        if (timer in l._T.battle) {
            clearTimeout(l._T.battle[timer]);
            delete l._T.battle[timer];
        }
    };

    l.killTimers = function () {
        for (var timer in l._T.battle) {
            clearTimeout(l._T.battle[timer]);
        }
        l._T.battle = {};
    };

    l.clickToMob = function () {
        var mobs = l.xG.$('.attack-holder .attack-item .attack-block'),
            mob,
            mobId;
        if (mobs.length > 0) {
            mob = $(mobs[(Math.floor(Math.random() * mobs.length))]);
            mobId = mob.siblings('.btn-attack').data('mobid');

            $.get("/js/fight/attackmob/", {bot: mobId, data: {}}, function (data) {
                //if (data.status == "ERROR") {
                //    (new Tg.Dialog).showMessage(data.msg);
                //}

                l.log('Attack mob (' + mobId + ')...');
                l.log(data);

                l.waitingMob();

            }, "json");


            //mob.trigger('click');
            //l.log('Attack mob (' + mobId + ')...');
            //l.waitingMob();
        }
    };

    l.waitingMob = function () {
        l.killTimer('waitingMobTimer');
        l._T.battle.waitingMobTimer = setInterval(function () {
            var _p = l.xG.$('.iframebattle-content .protection');

            if (_p.length > 0) {
                l.killTimer('waitingMobTimer');
                l.attack();
            }

        }, 12);
    };

    l.attack = function () {
        l._T.battle.attackMob = setInterval(function () {
            var _p = l.xG.$('.iframebattle-content .protection'),
                _abl = _p.find('li.ability a.ability:not(.inactive)'),//.not('.inactive'),
                _btn = _p.find('a.go-btn:not(.pressed)');//.not('.pressed');

            if (_p.length > 0) {
                if (_btn.length > 0) {
                    if (_abl.length > 0) {
                        _abl.each(function () {
                            var s = $(this),
                                ablId = s.data('ability');
                            if (ablId !== l.Player.ability.usedInd) {
                                l.Player.ability.usedInd = ablId;
                                s.trigger('click').find('.circle,.ability').trigger('click');
                                l.log('Умение ' + ablId + '...');
                                return false;
                            }
                        });
                    }

                    _btn.trigger('click');
                    l.log('Удар...');
                }
            } else {
                l.killTimer('attackMob');
                l.loop();
            }
        }, 250);
    };

    l.loop = function () {
        l.killTimers();
        if (l.Bot.state === 1) {
            l._T.battle.loopTimer = setInterval(function () {
                if (l.Bot.state === 1) {
                    l.log('Player health: ' + l.Player.health.min + ' ');

                    if (l.xG.$('.iframebattle-content .protection').length > 0) {
//                        l.killTimer('loopTimer');
                        l.killTimers();
                        l.attack();
                    }


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

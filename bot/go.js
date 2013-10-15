(function (window) {
    var head = document.getElementsByTagName('head')[0];
    var jq = document.createElement('script');
    jq.type = 'text/javascript';
    jq.async = true;

    jq.onload = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;

        script.textContent = '(function(e,t){e.Lomzik=e.Lomzik||{};var n=e.Lomzik;var r=document.getElementById("iframe_content").contentWindow;n.xG=r;n.bot={version:"version: 0.0.1",state:0,message:""};n.createPanel=function(){var e="<div>"+n.bot.version+"</div><div><span class=\'botAction\' data-state=\'1\'>Start</span> <span class=\'botAction\' data-state=\'0\'>Stop</span></div>";t("body").append("<div id=\'botPanel\'></div>");t("#botPanel").css({display:"block",position:"absolute",background:"#ffffff",zIndex:1e6,right:0,top:"100px",width:"262px",height:"100px"}).html(e)};n.createPanel();t("body").on("click","span.botAction",function(){n.bot.state=+t(this).data("state");console.log(n.bot.state);if(n.bot.state){n.loop()}});n.player={death:0,health:{min:0,max:0},ability:{usedInd:-1,used:-1}};n.setHealth=function(){setInterval(function(){var e=r.$(".bar-holder.helth .number").text().split("/");n.player.health.min=+e[0];n.player.health.max=+e[1]},12)};n.setHealth();n.useAbility=function(e){var i=r.$(".protection a.ability").not(".inactive"),s;i.attr("data-cost","-5");if(i.length>0){if(n.player.ability.usedInd<0){s=0}else{s=n.player.ability.usedInd?0:1}i.one("click",function(r){var i=t(this);r.preventDefault();n.player.ability.used=i.data("ability");n.player.ability.usedInd=s;console.log("Check ability: "+s);console.log(i.find("div.circle").attr("title"));setTimeout(function(){e.click()},120)});i.eq(s).click()}else{setTimeout(function(){e.click()},120)}};n.attackClick=function(){var e=setInterval(function(){var t=r.$(".protection a.go-btn").not(".pressed");var i=r.$(".jqmClose");if(t.length>0){clearTimeout(e);var s=setInterval(function(){var e=r.$(".jqmClose");if(e.length>0){clearTimeout(s);e.click();if(n.player.health.min<100){n.player.death++}if(n.player.death>5){n.bot.state=0;n.bot.message="The player died."}n.loop()}else{n.useAbility(t)}},240)}if(i.length>0){i.click();clearTimeout(e);n.mobClick()}},12)};n.mobClick=function(){var e=setInterval(function(){var t=r.$(".attack-holder .attack-item .attack-block");var i;if(t.length>0){i=t[Math.floor(Math.random()*t.length)];i.click();console.log("Attack mob...");clearTimeout(e);n.attackClick()}},12)};n.fightClick=function(){var e=r.$("li.fight>a");if(e.length>0){e.click();n.mobClick()}};n.loop=function(){if(n.bot.state===1){var e=setInterval(function(){var t=r.$(".jqmClose");t.click();if(n.bot.state===0){clearTimeout(e);console.log("Bot state = 0. Loop off.")}if(n.bot.state===1){console.log("Player health: "+n.player.health.min);if(n.player.health.min>n.player.health.max*.9){clearTimeout(e);n.fightClick()}}},1e4)}};n.loop();n.closeWindow=function(){setInterval(function(){var e=r.$(".jqmClose");if(e.length>1){e.last().click()}},12)};n.closeWindow()})(window,jQuery)';

        head.appendChild(script);

        console.log(script);
    };
    jq.src = "http://code.jquery.com/jquery-1.10.2.min.js";
    head.appendChild(jq);
})(window);
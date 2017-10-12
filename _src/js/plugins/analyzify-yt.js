/* global YT, parseFloat */

if (typeof window.ANALYZIFY !== 'undefined') {

    ANALYZIFY.yt = ANALYZIFY.yt || {};
    ANALYZIFY.yt.videos = document.querySelectorAll('[data-ytId]');
    ANALYZIFY.customEntries.ytReady = ANALYZIFY.customEntries.ytReady || {};

    if (ANALYZIFY.yt.videos.length) {

        ANALYZIFY.yt.players = [];
        ANALYZIFY.yt.videoTime;

        // Load IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        /**
         * Attaches listener once YouTube API is loaded.
         * ytPlayers[i] equivalent to event.target.
         **/
        function onYouTubeIframeAPIReady() {
            $(function () {
                for (i = 0; i < ANALYZIFY.yt.videos.length; i++) {
                    ANALYZIFY.yt.players.push(new YT.Player(ANALYZIFY.yt.videos[i].id, {
                        height: "9",
                        width: "16",
                        videoId: ANALYZIFY.yt.videos[i].getAttribute('data-ytId'),
                        playerVars: {
                            rel: 0,
                            showinfo: 0,
                            autoplay: 0,
                            enablejsapi: 1,
                            controls: 2
                        },
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange,
                            'onError': onPlayerError
                        }
                    }));
                }
                ANALYZIFY.setCustomEntry('ytReady');
            });
        }

        function onPlayerReady(event) {
            event["target"]["ready"] = true;
            event["target"]["lastAction"] = "ready";
        }

//    /**
//     * Listen for play/pause/jump.
//     * Also report % played every second
//     * @param event (evento)
//     **/
        function onPlayerStateChange(event) {
            ANALYZIFY.debug.yt !== true ? '' : console.log('last: ' + event["target"]["lastAction"]);

            event.data === YT.PlayerState.PLAYING && setTimeout(onPlayerPercent, 1000, event["target"]);
            var video_data = event.target["getVideoData"](),
                    label = video_data.title,
                    vidid = String(video_data.video_id);

            if (event["target"]["lastAction"] === "ready") {
                if (event.data === YT.PlayerState.PLAYING) {
                    ANALYZIFY.debug.yt !== true ?
                            ANALYZIFY.dlPush('youtube', 'firstplay', vidid + ' - ' + label, ANALYZIFY.activeTimer.counter, false, 'beacon', {
                                interval: ANALYZIFY.timerInterval({120: 30}, 'sec', ANALYZIFY.activeTimer.counter)
                            }) :
                            console.log('FIRSTPLAY: ' + ANALYZIFY.activeTimer.counter + ' seg');
                    ANALYZIFY.jqLink.func({
                        'customTimer': [vidid],
                        'customActiveMaster': [vidid, true]
                    });
                    event["target"]["lastAction"] = "firstplay";
                    event["target"]["justChanged"] = false;
                }
            } else if (event.data === YT.PlayerState.PLAYING && event["target"]["autoStatChange"] === true && event["target"]["autoPlayed"] === true) {
                ANALYZIFY.yt.videoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                ANALYZIFY.debug.yt !== true ?
                        ANALYZIFY.dlPush('youtube', 'autoplay', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, false, 'beacon', 'fb', {
                            interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                        }) :
                        console.log('AUTOPLAY: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                event["target"]["lastAction"] = "play";
                event["target"]["justChanged"] = false;
                event["target"]["autoPlayed"] = false;
            } else if (event.data === YT.PlayerState.PLAYING && event["target"]["lastAction"] === "pause" && event.target.getCurrentTime() - event["target"]["pausedTime"] < 1 && event.target.getCurrentTime() - event["target"]["pausedTime"] >= -1 && event["target"]["justChanged"] === false) {
                ANALYZIFY.yt.videoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                ANALYZIFY.debug.yt !== true ?
                        ANALYZIFY.dlPush('youtube', 'play', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, false, 'beacon', 'fb', {
                            interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                        }) :
                        console.log('PLAY: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                event["target"]["lastAction"] = "play";
                event["target"]["justChanged"] = false;
            } else if (event.data === YT.PlayerState.PLAYING && event["target"]["lastAction"] === "pause") {
                ANALYZIFY.yt.videoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                ANALYZIFY.debug.yt !== true ?
                        ANALYZIFY.dlPush('youtube', 'jump', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, false, 'beacon', 'fb', {
                            interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                        }) :
                        console.log('JUMP: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                event["target"]["lastAction"] = "jump";
                event["target"]["justChanged"] = false;
            } else if (event.data === YT.PlayerState.PAUSED && event["target"]["autoStatChange"] === true && event["target"]["autoPaused"] === true) {
                event["target"]["pausedTime"] = event.target.getCurrentTime();
                ANALYZIFY.yt.videoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                ANALYZIFY.debug.yt !== true ?
                        ANALYZIFY.dlPush('youtube', 'autopause', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, false, 'beacon', 'fb', {
                            interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                        }) :
                        console.log('AUTOPAUSE: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                event["target"]["lastAction"] = "pause";
                event["target"]["justChanged"] = false;
                event["target"]["autoPaused"] = false;
            } else if (event.data === YT.PlayerState.PAUSED && (event["target"]["lastAction"] === "firstplay" || event["target"]["lastAction"] === "play" || event["target"]["lastAction"] === "jump")) {
                event["target"]["pausedTime"] = event.target.getCurrentTime();
                setTimeout(function () {
                    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING || event["target"]["justChanged"] === true) {
                        '';
                    } else {
                        ANALYZIFY.yt.videoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                        ANALYZIFY.debug.yt !== true ?
                                ANALYZIFY.dlPush('youtube', 'pause', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, true, 'beacon', 'fb', {
                                    interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                                }) :
                                console.log('PAUSE: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                        event["target"]["autoStatChange"] = false;
                    }
                }, 200);
                event["target"]["lastAction"] = "pause";
                event["target"]["justChanged"] = false;
            } else {
                event["target"]["justChanged"] = true;
            }

            if (event.data === YT.PlayerState.PLAYING) {
                ANALYZIFY.activeTimer.activeMaster = true;
                ANALYZIFY.jqLink.func({
                    'customActiveMaster': [vidid, true]
                });
            } else {
                if (event["target"]["lastAction"] !== "ready") {
                    ANALYZIFY.activeTimer.activeMaster = false;
                    ANALYZIFY.jqLink.func({
                        'customActiveMaster': [vidid, false],
                        'customUserNonIdle': [vidid, false]
                    });
                }
            }
        }

        /**
         * Catch all to report errors through the GTM data layer. once the error is exposed to GTM, it can be tracked in UA as an event!
         * Refer to https://developers.google.com/youtube/js_api_reference#Events onError
         * @param event (evento)
         **/

        function onPlayerError(event) {
            console.log('error');
        }

        /**
         * Report the % played if it matches 0%, 25%, 50%, 75%, 90% or completed.
         * window.timer is used in caso it is lower than current time.
         * @param event (evento)
         **/
        function onPlayerPercent(event) {
            if (event["getPlayerState"]() === YT.PlayerState.PLAYING) {
                var video_data = event["getVideoData"](),
                        label = video_data.title,
                        vidid = video_data.video_id;

                // Set the played duration to every tenth because we'll need to also capture 90% played.
                var currentTime = event["getCurrentTime"]() <= ANALYZIFY.customTimers[vidid]['activeTimer'] ? event["getCurrentTime"]() : ANALYZIFY.customTimers[vidid]['activeTimer'];
                var t = event["getDuration"]() - currentTime <= 1.5 ? 1 : (Math.floor(currentTime / event["getDuration"]() * 10) / 10).toFixed(2);

                if (parseFloat(t) > 0.90) {
                    t = 0.90;
                } else if (parseFloat(t) > 0.80) {
                    t = 0.80;
                } else if (parseFloat(t) > 0.70) {
                    t = 0.70;
                } else if (parseFloat(t) > 0.60) {
                    t = 0.60;
                } else if (parseFloat(t) > 0.50) {
                    t = 0.50;
                } else if (parseFloat(t) > 0.40) {
                    t = 0.40;
                } else if (parseFloat(t) > 0.30) {
                    t = 0.30;
                } else if (parseFloat(t) > 0.20) {
                    t = 0.20;
                } else if (parseFloat(t) > 0.10) {
                    t = 0.10;
                } else if (parseFloat(t) > 0.00) {
                    t = 0.00;
                }
                // duration t needs to be fixed to 2 decimal places
                t = parseFloat(t).toFixed(2);

                if (!event["lastP"] || t > event["lastP"]) {
                    event["lastP"] = t;
                    if (!(t == 0.00)) {
                        ANALYZIFY.debug.yt !== true ?
                                ANALYZIFY.dlPush('youtube', 'watch', vidid + ' - ' + label, t * 100, false, 'beacon') :
                                console.log('ASSISTIDO: ' + t * 100 + '%  /  ' + vidid + ' - ' + label);
                    }
                }
                event["lastP"] != 1 && setTimeout(onPlayerPercent, 1000, event);
            }
        }

        /**
         * Add unload event listener when user close exit with video playing.
         * @param order (evento)
         **/
        ANALYZIFY.yt.exit = function (order) {
            if (ANALYZIFY.yt.players.length) {
                if (typeof order === "undefined") {
                    for (var i = 0; i < ANALYZIFY.yt.players.length; i++) {
                        if (ANALYZIFY.yt.players[i].ready === true && ANALYZIFY.yt.players[i].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                            var video_data = ANALYZIFY.yt.players[i].getVideoData(),
                                    label = video_data.title,
                                    vidid = video_data.video_id;
                            ANALYZIFY.yt.videoTime = parseInt(ANALYZIFY.yt.players[i].getCurrentTime() / ANALYZIFY.yt.players[i].getDuration() * 100);

                            ANALYZIFY.debug.yt !== true ?
                                    ANALYZIFY.dlPush('youtube', 'exit', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, true, 'beacon', 'fb', {
                                        interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                                    }) :
                                    console.log('SAIU: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                        }
                    }
                } else {
                    if (ANALYZIFY.yt.players[order].ready === true && ANALYZIFY.yt.players[order].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                        var video_data = ANALYZIFY.yt.players[order].getVideoData(),
                                label = video_data.title,
                                vidid = video_data.video_id;
                        ANALYZIFY.yt.videoTime = parseInt(ANALYZIFY.yt.players[order].getCurrentTime() / ANALYZIFY.yt.players[order].getDuration() * 100);

                        ANALYZIFY.debug.yt !== true ?
                                ANALYZIFY.dlPush('youtube', 'exit', vidid + ' - ' + label, ANALYZIFY.yt.videoTime, true, 'beacon', 'fb', {
                                    interval: ANALYZIFY.timerInterval({100: 20}, '%', ANALYZIFY.yt.videoTime)
                                }) :
                                console.log('SAIU: ' + ANALYZIFY.yt.videoTime + '%  /  ' + vidid + ' - ' + label);
                    }
                }
            }
        };

        //Pause video
        ANALYZIFY.yt.pause = function (order) {
            if (typeof order === "undefined") {
                for (var i = 0; i < ANALYZIFY.yt.players.length; i++) {
                    if (ANALYZIFY.yt.players[i].ready === true && ANALYZIFY.yt.players[i].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                        ANALYZIFY.yt.players[i].pauseVideo();
                        ANALYZIFY.yt.players[i].autoStatChange = true;
                        ANALYZIFY.yt.players[i].autoPaused = true;
                    }
                }
            } else {
                if (ANALYZIFY.yt.players[order].ready === true && ANALYZIFY.yt.players[order].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                    ANALYZIFY.yt.players[order].pauseVideo();
                    ANALYZIFY.yt.players[order].autoStatChange = true;
                    ANALYZIFY.yt.players[order].autoPaused = true;
                }
            }
        };

        //Play video
        ANALYZIFY.yt.play = function (order) {
            if (typeof order === "undefined") {
                for (var i = 0; i < ANALYZIFY.yt.players.length; i++) {
                    if (ANALYZIFY.yt.players[i].ready === true && ANALYZIFY.yt.players[i].getPlayerState() === YT.PlayerState.PAUSED && ANALYZIFY.yt.players[i].autoStatChange === true) { // paused and automode
                        ANALYZIFY.yt.players[i].playVideo();
                        ANALYZIFY.yt.players[i].autoPlayed = true;
                    }
                }
            } else {
                if (ANALYZIFY.yt.players[order].ready === true && ANALYZIFY.yt.players[order].getPlayerState() === YT.PlayerState.PAUSED) { // paused 
                    ANALYZIFY.yt.players[order].playVideo();
                    ANALYZIFY.yt.players[order].autoPlayed = true;
                }
            }
        };

        ANALYZIFY.yt.load = function (id, autoplay, start, end, order) {
            order = order || 0;
            if (ANALYZIFY.yt.players.length) {
                var load = (autoplay === true || autoplay === 'true' || autoplay === 1 ? 'loadVideoById' : 'cueVideoById');
                if (typeof id !== "undefined") {
                    if (ANALYZIFY.yt.players[order]["lastAction"] !== "ready") {
                        //Get Video Data
                        var video_data = ANALYZIFY.yt.players[order].getVideoData(),
                                vidid = video_data.video_id;
                        A.ytExit(order);
                        //Finish Previous Video Metrics and Unset Previous Custom Timer
                        ANALYZIFY.jqLink.func({
                            'unsetCustomTimer': [vidid]
                        });
                    }
                    if (autoplay === true || autoplay === 'true' || autoplay === 1) {
                        ANALYZIFY.jqLink.func({
                            'customTimer': [id],
                            'customActiveMaster': [id, true]
                        });
                    }
                    ANALYZIFY.yt.players[order][load]({
                        videoId: id,
                        startSeconds: parseInt(start),
                        endSeconds: parseInt(end)
                    });
                    if (!(autoplay === true || autoplay === 'true' || autoplay === 1)) {
                        ANALYZIFY.yt.players[order]["lastAction"] = 'ready';
                    }
                }
            } else {
                ANALYZIFY.yt.videos[order].setAttribute("data-ytId", id);
            }
        };

        //CUSTOM ENTRIES
        Object.assign(ANALYZIFY.customEntries.beforeUnload, {
            'ytExit': {
                action: function(){
                    ANALYZIFY.yt.exit();
                }
            }
        });
        Object.assign(ANALYZIFY.customEntries.pageShow, {
            'ytPause': {
                action: function(){
                    ANALYZIFY.yt.viewEvent('youtube', true);
                }
            }
        });
        Object.assign(ANALYZIFY.customEntries.pageHidden, {
            'ytPause': {
                action: function(){
                    ANALYZIFY.yt.pause();
                }
            }
        });
    }
} else {
    console.error('YouTube plugin must be loaded after Analyzify main script');
}
/* global YT, parseFloat */

var ytVideos = document.querySelectorAll('[data-ytId]');

if (ytVideos.length) {

    var ytDebug = true;
    var ytPlayers = [];
    var ytVideoTime;

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
        for (i = 0; i < ytVideos.length; i++) {
            ytPlayers.push(new YT.Player(ytVideos[i].id, {
                height: '360',
                width: '640',
                videoId: ytVideos[i].getAttribute('data-ytId'),
                playerVars: {
                    rel: 0,
                    showinfo: 0,
                    autoplay: 0,
                    enablejsapi: 1,
                    origin: window.BASE,
                    controls: 2
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            }));
        }
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
        ytDebug === false ? '' : console.log('last: ' + event["target"]["lastAction"]);

        event.data === YT.PlayerState.PLAYING && setTimeout(onPlayerPercent, 1000, event["target"]);
        var video_data = event.target["getVideoData"](),
                label = video_data.title,
                vidid = video_data.video_id;

        if (event["target"]["lastAction"] === "ready") {
            if (event.data === YT.PlayerState.PLAYING) {
                ytDebug === false ?
                        dlPush('youtube', 'firstplay', vidid + ' - ' + label, window.activeTimer, false, 'beacon') :
                        console.log('FIRSTPLAY: ' + window.activeTimer + ' seg');
                window.jqLink.func({
                    customTimer: [vidid],
                    customActiveMaster: [vidid, true]
                });
                event["target"]["lastAction"] = "firstplay";
                event["target"]["justChanged"] = false;
            }
        } else if (event.data === YT.PlayerState.PLAYING && event["target"]["autoStatChange"] === true && event["target"]["autoPlayed"] === true) {
            ytVideoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
            ytDebug === false ?
                    dlPush('youtube', 'autoplay', vidid + ' - ' + label, ytVideoTime, false, 'beacon', 'fb') :
                    console.log('AUTOPLAY: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
            event["target"]["lastAction"] = "play";
            event["target"]["justChanged"] = false;
            event["target"]["autoPlayed"] = false;
        } else if (event.data === YT.PlayerState.PLAYING && event["target"]["lastAction"] === "pause" && event.target.getCurrentTime() - event["target"]["pausedTime"] < 1 && event.target.getCurrentTime() - event["target"]["pausedTime"] >= -1 && event["target"]["justChanged"] === false) {
            ytVideoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
            ytDebug === false ?
                    dlPush('youtube', 'play', vidid + ' - ' + label, ytVideoTime, false, 'beacon', 'fb') :
                    console.log('PLAY: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
            event["target"]["lastAction"] = "play";
            event["target"]["justChanged"] = false;
        } else if (event.data === YT.PlayerState.PLAYING && event["target"]["lastAction"] === "pause") {
            ytVideoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
            ytDebug === false ?
                    dlPush('youtube', 'jump', vidid + ' - ' + label, ytVideoTime, false, 'beacon', 'fb') :
                    console.log('JUMP: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
            event["target"]["lastAction"] = "jump";
            event["target"]["justChanged"] = false;
        } else if (event.data === YT.PlayerState.PAUSED && event["target"]["autoStatChange"] === true && event["target"]["autoPaused"] === true) {
            event["target"]["pausedTime"] = event.target.getCurrentTime();
            ytVideoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
            ytDebug === false ?
                    dlPush('youtube', 'autopause', vidid + ' - ' + label, ytVideoTime, false, 'beacon', 'fb') :
                    console.log('AUTOPAUSE: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
            event["target"]["lastAction"] = "pause";
            event["target"]["justChanged"] = false;
            event["target"]["autoPaused"] = false;
        } else if (event.data === YT.PlayerState.PAUSED && (event["target"]["lastAction"] === "firstplay" || event["target"]["lastAction"] === "play" || event["target"]["lastAction"] === "jump")) {
            event["target"]["pausedTime"] = event.target.getCurrentTime();
            setTimeout(function () {
                if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING || event["target"]["justChanged"] === true) {
                    '';
                } else {
                    ytVideoTime = parseInt(event.target.getCurrentTime() / event.target.getDuration() * 100);
                    ytDebug === false ?
                            dlPush('youtube', 'pause', vidid + ' - ' + label, ytVideoTime, true, 'beacon', 'fb') :
                            console.log('PAUSE: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
                    event["target"]["autoStatChange"] = false;
                }
            }, 200);
            event["target"]["lastAction"] = "pause";
            event["target"]["justChanged"] = false;
        } else {
            event["target"]["justChanged"] = true;
        }

        if (event.data === YT.PlayerState.PLAYING) {
            window.activeMaster = true;
            window.jqLink.func({
                customActiveMaster: [vidid, true]
            });
        } else {
            if (event["target"]["lastAction"] !== "ready") {
                window.activeMaster = false;
                window.jqLink.func({
                    customActiveMaster: [vidid, false],
                    customUserNonIdle: [vidid, false]
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
            var currentTime = event["getCurrentTime"]() <= window['customTimers'][vidid]['activeTimer'] ? event["getCurrentTime"]() : window['customTimers'][vidid]['activeTimer'];
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
                    ytDebug === false ?
                            dlPush('youtube', 'watch', vidid + ' - ' + label, t * 100, false, 'beacon') :
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
    function ytExit(order) {
        if (ytPlayers.length) {
            if (typeof order === "undefined") {
                for (var i = 0; i < ytPlayers.length; i++) {
                    if (ytPlayers[i].ready === true && ytPlayers[i].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                        var video_data = ytPlayers[i].getVideoData(),
                                label = video_data.title,
                                vidid = video_data.video_id;
                        ytVideoTime = parseInt(ytPlayers[i].getCurrentTime() / ytPlayers[i].getDuration() * 100);
                        ytDebug === false ?
                                dlPush('youtube', 'exit', vidid + ' - ' + label, ytVideoTime, true, 'beacon', 'fb') :
                                console.log('SAIU: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
                    }
                }
            } else {
                if (ytPlayers[order].ready === true && ytPlayers[order].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                    var video_data = ytPlayers[order].getVideoData(),
                            label = video_data.title,
                            vidid = video_data.video_id;
                    ytVideoTime = parseInt(ytPlayers[order].getCurrentTime() / ytPlayers[order].getDuration() * 100);
                    ytDebug === false ?
                            dlPush('youtube', 'exit', vidid + ' - ' + label, ytVideoTime, true, 'beacon', 'fb') :
                            console.log('SAIU: ' + ytVideoTime + '%  /  ' + vidid + ' - ' + label);
                }
            }
        }
    }

    //Pause video
    function ytPause(order) {
        if (typeof order === "undefined") {
            for (var i = 0; i < ytPlayers.length; i++) {
                if (ytPlayers[i].ready === true && ytPlayers[i].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                    ytPlayers[i].pauseVideo();
                    ytPlayers[i].autoStatChange = true;
                    ytPlayers[i].autoPaused = true;
                }
            }
        } else {
            if (ytPlayers[order].ready === true && ytPlayers[order].getPlayerState() === YT.PlayerState.PLAYING) { // playing
                ytPlayers[order].pauseVideo();
                ytPlayers[order].autoStatChange = true;
                ytPlayers[order].autoPaused = true;
            }
        }
    }

    //Play video
    function ytPlay(order) {
        if (typeof order === "undefined") {
            for (var i = 0; i < ytPlayers.length; i++) {
                if (ytPlayers[i].ready === true && ytPlayers[i].getPlayerState() === YT.PlayerState.PAUSED && ytPlayers[i].autoStatChange === true) { // paused and automode
                    ytPlayers[i].playVideo();
                    ytPlayers[i].autoPlayed = true;
                }
            }
        } else {
            if (ytPlayers[order].ready === true && ytPlayers[order].getPlayerState() === YT.PlayerState.PAUSED) { // paused 
                ytPlayers[order].playVideo();
                ytPlayers[order].autoPlayed = true;
            }
        }
    }

    function ytLoad(id, autoplay, start, end, order) {
        order = order || 0;
        if (ytPlayers.length) {
            var load = (autoplay === true || autoplay === 'true' || autoplay === 1 ? 'loadVideoById' : 'cueVideoById');
            if (typeof id !== "undefined") {
                if (ytPlayers[order]["lastAction"] !== "ready") {
                    //Get Video Data
                    var video_data = ytPlayers[order].getVideoData(),
                            vidid = video_data.video_id;
                    ytExit(order);
                    //Finish Previous Video Metrics and Unset Previous Custom Timer
                    window.jqLink.func({
                        unsetCustomTimer: [vidid]
                    });
                }
                if (autoplay === true || autoplay === 'true' || autoplay === 1) {
                    window.jqLink.func({
                        customTimer: [id],
                        customActiveMaster: [id, true]
                    });
                }
                ytPlayers[order][load]({
                    videoId: id,
                    startSeconds: parseInt(start),
                    endSeconds: parseInt(end)
                });
                if (!(autoplay === true || autoplay === 'true' || autoplay === 1)) {
                    ytPlayers[order]["lastAction"] = 'ready';
                }
            }
        } else {
            ytVideos[order].setAttribute("data-ytId", id);
        }
    }

}
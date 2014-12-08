Ext.define('Aumnia.common.YouTubePlayer', {
    extend: 'Ext.Container',
    xtype: 'youtubeplayer',

    requires: [
        'Ext.Toast'
    ],
    config: {
        url: 'https://www.youtube.com/v/',
        videoId: null,
        iframe: null, // DOM node
        isReady: false,
        hasPlayed: false,
        currentState: null,
        // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
        controls: 1,
        autoPlay: 0,
        autoHide: 1,
        loop: 0,
        showInfo: 0,
        modestBranding: 1,
        start: 0,
        playsInline: 1,
        showRelatedVideos: 0,
        origin: 'https://' + window.location.host
    },

    updateHasPlayed: function (hasPlayed) {
        if (hasPlayed) {
        }
    },

    onPlayerApiChange: function (e) {
        this.fireEvent('playerapichange', e, this);
    },

    onPlayerError: function (e) {
        this.fireEvent('playererror', e, this);
    },

    onPlayerPlaybackQualityChange: function (e) {
        this.fireEvent('playbackqualitychange', e, this);
    },

    onPlayerStateChange: function (e) {
        var state = e.data;
        this.setCurrentState(state);
        this.fireEvent('playerstatechange', state, this);
    },

    onPlayerReady: function (e) {
        var view = this,
            player = e.target,
            elem = player.getIframe();

        view.setIsReady(true);
        view.setIframe(elem);
        view.fireEvent('playerready', e, player, this);
    },

    initialize: function () {
        this.callParent(arguments);

        var me = this,
            playerId = this.getInnerHtmlElement().getId();  // YT replaces this DOM element with iframe

        // Callback the YT API calls when it is ready, see onPlayerReady for the player itself.
        window.onYouTubeIframeAPIReady = function () {
            var width = me.element.getWidth() || 400,
                height = me.element.getHeight() || 200;

            me.player = new YT.Player(playerId, {
                height: height,
                width: width - 10,
                videoId: me.getVideoId(),
                playerVars: {
                    wmode: 'transparent',
                    controls: me.getControls(),
                    autohide: me.getAutoHide(),
                    autoplay: me.getAutoPlay(),
                    loop: me.getLoop(),
                    showinfo: me.getShowInfo(),
                    modestbranding: me.getModestBranding(),
                    start: me.getStart(),
                    playsinline: me.getPlaysInline(),
                    rel: me.getShowRelatedVideos(),
                    origin: me.getOrigin()
                },
                events: {
                    onApiChange: Ext.Function.bind(me.onPlayerApiChange, me),
                    onError: Ext.Function.bind(me.onPlayerError, me),
                    onPlaybackQualityChange: Ext.Function.bind(me.onPlayerPlaybackQualityChange, me),
                    onReady: Ext.Function.bind(me.onPlayerReady, me),
                    onStateChange: Ext.Function.bind(me.onPlayerStateChange, me)
                }
            });

            me.fireEvent('youtubeiframeapiready', me);
        }

        // load api if necessary
        if (typeof YT == 'undefined') {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = 1;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        //me.relayEvents(me.element, ['touchstart', 'touchend', 'tap']);
    },

    stop: function () {
        this.player.stopVideo();
    },

    play: function () {
        this.player.playVideo();
    },

    pause: function () {
        this.player.pauseVideo();
    },

    getState: function () {
        return this.player.getPlayerState();
    },

    getCurrentTime: function () {
        return this.player.getCurrentTime();
    },

    cueVideo: function (start) {
        this.player.cueVideoById({
            videoId: this.getVideoId(),
            startSeconds: start || this.getStart()
        });

    }

});
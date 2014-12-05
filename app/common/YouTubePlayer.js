Ext.define('Aumnia.common.YouTubePlayer', {
    extend: 'Ext.Container',
    xtype: 'youtubeplayer',

    requires: [
    ],
    config: {
        url: 'https://www.youtube.com/v/',
        videoId: null,
        iframe: null, // DOM node
        autoPlay: 0,  // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
        autoHide: 1, 
        loop: 0,
        showInfo: 0,
        modestBranding: 1,
        start: 0,
        playsInline: 1,
        showRelatedVideos: 0,
        theme: 'light',
        origin: 'https://' + window.location.host
    },

    onPlayerApiChange: function (e) {
        // <debug>
        console.log("***** onPlayerApiChange");
        // </debug>
        this.fireEvent('playerapichange', this, arguments);
    },

    onPlayerError: function (e) {
        // <debug>
        console.log("***** onPlayerError: ", e);
        // </debug>
        this.fireEvent('playererror', this, arguments);
    },

    onPlayerPlaybackQualityChange: function (e) {
        // <debug>
        console.log("***** onPlayerPlaybackQualityChange");
        // </debug>
        this.fireEvent('playbackqualitychange', this, arguments);
    },

    onPlayerStateChange: function (e) {
        // <debug>
        console.log("***** onPlayerStateChange: ", e);
        // </debug>

        this.fireEvent('statechange', this, arguments);
    },

    onPlayerReady: function (e) {
        // <debug>
        console.log("***** onPlayerReady: ", e);
        // </debug>

        this.setIframe(this.player.getIframe());
        this.fireEvent('playerready', this, arguments);
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
                    autohide: me.getAutoHide(),
                    autoplay: me.getAutoPlay(),
                    loop: me.getLoop(),
                    showinfo: me.getShowInfo(),
                    modestbranding: me.getModestBranding(),
                    start: me.getStart(),
                    playsinline: me.getPlaysInline(),
                    rel: me.getShowRelatedVideos(),
                    theme: me.getTheme(),
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

            me.fireEvent('youtubeiframeapiready', arguments);

            // <debug>
            console.log("***** end of YouTubeIframeAPIReady: ", width, height);
            // </debug>
        }

        // load api if necessary
        if (typeof YT == 'undefined') {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            //tag.async = 1;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // <debug>
        console.log("**** end of Sencha container initialize");
        // </debug>
    },

    stop: function () {
        // <debug>
        console.log("***** stop");
        // </debug>
        this.player.stopVideo();
    },

    play: function () {
        // <debug>
        console.log("***** play");
        // </debug>
        this.player.playVideo();
    },

    pause: function () {
        // <debug>
        console.log("***** pause");
        // </debug>
        this.player.pauseVideo();
    },

    cueVideo: function (start) {
        if (this.player) {
            this.player.cueVideoById({
                videoId: this.getVideoId(),
                startSeconds: this.getStart()
            });
        }
    },

    getCurrentTime: function () {
        return this.player.getCurrentTime();
    }

});
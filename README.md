YouTubePlayer
=============

Sencha Touch wrapper around the YouTube iframe javascript HTML5 player from
http://training.figleaf.com/tutorials/senchacomplete/chapter2/lesson10/6.cfm

usage
=========
```
items: [
    {
        html: '<h2>Your title</h2>'
    },
    {
        itemId: 'youTubePlayer',
        cls: 'video-container',
        xtype: 'youtubeplayer',
        videoId: 'rp6MupFwm8U'
    }
]
```

limitations
===========

Touch events are not accessible in the iframe so scroll is inhibited if you use the player area.

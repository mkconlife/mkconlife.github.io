document.addEventListener('DOMContentLoaded', function() {
    var STATE_KEY = 'aplayer_state';
    var saved = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');

    var container = document.createElement('div');
    container.id = 'aplayer';
    container.style.cssText = 'position:fixed;bottom:0;left:0;z-index:999;width:100%;';
    document.body.appendChild(container);

    var ap = new APlayer({
        container: container,
        fixed: true,
        audio: [{
            name: 'Welt Joyce',
            artist: 'HOYO-MIX',
            url: '/music/welt-joyce.mp3',
            cover: '/music/picture/welt-joyce.png'
        }]
    });

    if (saved.currentTime) {
        ap.seek(saved.currentTime);
    }
    if (saved.playing) {
        ap.play();
    }

    ap.on('play', function() {
        localStorage.setItem(STATE_KEY, JSON.stringify({ playing: true, currentTime: ap.audio.currentTime }));
    });
    ap.on('pause', function() {
        localStorage.setItem(STATE_KEY, JSON.stringify({ playing: false, currentTime: ap.audio.currentTime }));
    });
    setInterval(function() {
        var state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
        state.currentTime = ap.audio.currentTime;
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }, 1000);
});

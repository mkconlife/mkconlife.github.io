(function() {
    if (window._aplayer) return;

    var container = document.createElement('div');
    container.id = 'aplayer';
    container.style.cssText = 'position:fixed;bottom:0;left:0;z-index:999;width:100%;';
    document.body.appendChild(container);

    window._aplayer = new APlayer({
        container: container,
        fixed: true,
        audio: [{
            name: 'Welt Joyce',
            artist: 'HOYO-MIX',
            url: '/music/welt-joyce.mp3',
            cover: '/music/picture/welt-joyce.png'
        }]
    });
})();

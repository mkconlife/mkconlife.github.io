(function () {
    if (window._aplayer) return;

    var wrapper = document.createElement('div');
    wrapper.id = 'aplayer';
    wrapper.style.cssText = 'position:fixed;bottom:15px;left:15px;z-index:999;width:280px;';
    document.body.appendChild(wrapper);

    var supportsOpus = (function () {
        try { return new Audio().canPlayType('audio/ogg; codecs="opus"') !== ''; }
        catch (e) { return false; }
    })();
    var ext = supportsOpus ? '.ogg' : '.mp3';

    window._aplayer = new APlayer({
        container: wrapper,
        fixed: false,
        preload: 'metadata',
        audio: [{
            name: 'Welt Joyce',
            artist: 'HOYO-MIX',
            url: '/music/welt-joyce' + ext,
            cover: '/music/picture/welt-joyce.png'
        }]
    });

    setTimeout(initDrag, 500);

    function initDrag() {
        var style = document.createElement('style');
        style.textContent =
            '#aplayer{cursor:grab;transition:none!important;overflow:visible!important}' +
            '#aplayer input,#aplayer button,#aplayer a,#aplayer [role="button"]{cursor:pointer}' +
            '#aplayer .aplayer-volume-bar-wrap{min-height:35px!important;height:35px!important}' +
            '#aplayer .aplayer-volume-bar{min-height:0!important}';
        document.head.appendChild(style);

        var dragging = false;
        var moved = false;
        var sx, sy, ox, oy;

        function onStart(e) {
            var t = e.touches ? e.touches[0] : e;
            if (e.target.closest('input,select,textarea,a,button,[role="button"],.aplayer-bar-wrap,.aplayer-volume-bar-wrap,.aplayer-miniswitcher,.aplayer-button,.aplayer-icon,.aplayer-lrc')) return;
            e.preventDefault();
            sx = t.clientX;
            sy = t.clientY;
            var rect = wrapper.getBoundingClientRect();
            ox = rect.left;
            oy = rect.top;
            dragging = false;
            moved = false;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onUp);
        }

        function onMove(e) {
            var t = e.touches ? e.touches[0] : e;
            var dx = t.clientX - sx;
            var dy = t.clientY - sy;
            if (!dragging) {
                if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
                dragging = true;
                moved = true;
                wrapper.style.transition = 'none';
                wrapper.style.cursor = 'grabbing';
                wrapper.style.bottom = 'auto';
                wrapper.style.right = 'auto';
            }
            if (e.cancelable) e.preventDefault();
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var ww = wrapper.offsetWidth;
            var wh = wrapper.offsetHeight;
            var nx = Math.max(0, Math.min(ox + dx, vw - ww));
            var ny = Math.max(0, Math.min(oy + dy, vh - wh));
            wrapper.style.left = nx + 'px';
            wrapper.style.top = ny + 'px';
        }

        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
            wrapper.style.cursor = 'grab';
            if (dragging) {
                dragging = false;
                setTimeout(function () { moved = false; }, 0);
            }
        }

        wrapper.addEventListener('mousedown', onStart);
        wrapper.addEventListener('touchstart', onStart, { passive: false });

        wrapper.addEventListener('click', function (e) {
            if (moved) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        window.addEventListener('resize', function () {
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var rect = wrapper.getBoundingClientRect();
            var nx = Math.max(0, Math.min(rect.left, vw - wrapper.offsetWidth));
            var ny = Math.max(0, Math.min(rect.top, vh - wrapper.offsetHeight));
            wrapper.style.left = nx + 'px';
            wrapper.style.top = ny + 'px';
            wrapper.style.bottom = 'auto';
            wrapper.style.right = 'auto';
        });

        var volWrap = wrapper.querySelector('.aplayer-volume-bar-wrap');
        if (volWrap) {
            var volBar = volWrap.querySelector('.aplayer-volume-bar');
            volWrap.addEventListener('click', function (e) {
                var ap = window._aplayer;
                if (!ap || !volBar) return;
                var rect = volBar.getBoundingClientRect();
                var vol = 1 - (e.clientY - rect.top) / rect.height;
                ap.volume(Math.max(0, Math.min(1, vol)));
            });
            volWrap.setAttribute('tabindex', '0');
            volWrap.addEventListener('keydown', function (e) {
                var ap = window._aplayer;
                if (!ap) return;
                var vol = ap.volume || 0;
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    ap.volume(Math.min(1, vol + 0.05));
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    ap.volume(Math.max(0, vol - 0.05));
                }
            });
        }
    }
})();

(function () {
    if (window._aplayer) return;

    var wrapper = document.createElement('div');
    wrapper.id = 'aplayer';
    wrapper.style.cssText = 'position:fixed;bottom:30px;left:15px;z-index:999;width:280px;';
    document.body.appendChild(wrapper);

    window._aplayer = new APlayer({
        container: wrapper,
        fixed: false,
        audio: [{
            name: 'Welt Joyce',
            artist: 'HOYO-MIX',
            url: '/music/welt-joyce.mp3',
            cover: '/music/picture/welt-joyce.png'
        }]
    });

    setTimeout(initDrag, 500);

    function initDrag() {
        var el = wrapper.querySelector('.aplayer');
        if (!el) return;

        var style = document.createElement('style');
        style.textContent =
            '#aplayer{transition:none!important}' +
            '#aplayer .aplayer{cursor:grab;transition:none!important}' +
            '#aplayer .aplayer input,#aplayer .aplayer button,#aplayer .aplayer a,#aplayer .aplayer [role="button"]{cursor:pointer}';
        document.head.appendChild(style);

        var dragging = false;
        var moved = false;
        var sx, sy, ox, oy;

        wrapper.addEventListener('mousedown', function (e) {
            if (e.target.closest('input,select,textarea,a,button,[role="button"],.aplayer-bar-wrap,.aplayer-volume-bar-wrap,.aplayer-miniswitcher')) return;
            e.preventDefault();
            sx = e.clientX;
            sy = e.clientY;
            var rect = wrapper.getBoundingClientRect();
            ox = rect.left;
            oy = rect.top;
            dragging = false;
            moved = false;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        function onMove(e) {
            var dx = e.clientX - sx;
            var dy = e.clientY - sy;
            if (!dragging) {
                if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
                dragging = true;
                moved = true;
                wrapper.style.transition = 'none';
                el.style.cursor = 'grabbing';
                wrapper.style.bottom = 'auto';
                wrapper.style.right = 'auto';
            }
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
            el.style.cursor = 'grab';
            if (dragging) {
                dragging = false;
                setTimeout(function () { moved = false; }, 0);
            }
        }

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
    }
})();

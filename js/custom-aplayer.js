(function() {
    if (window._aplayer) return;

    var container = document.createElement('div');
    container.id = 'aplayer';
    container.style.cssText = 'position:fixed;bottom:30px;left:15px;z-index:999;width:calc(100% - 30px);';
    document.body.appendChild(container);

    var style = document.createElement('style');
    style.textContent =
        '.aplayer-draggable{top:30px!important;left:15px!important;bottom:auto!important;right:auto!important;position:fixed!important;cursor:grab}' +
        '.aplayer-draggable.aplayer-is-dragging{cursor:grabbing!important}' +
        '.aplayer-draggable input,.aplayer-draggable button,.aplayer-draggable a{cursor:pointer}';
    document.head.appendChild(style);

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

    var el = container.querySelector('.aplayer');
    if (!el) return;
    el.classList.add('aplayer-draggable');

    var isDragging = false;
    var wasDragged = false;
    var startX, startY, origLeft, origTop;
    var THRESHOLD = 5;

    function clamp(x, y) {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var w = el.offsetWidth;
        var h = el.offsetHeight;
        x = Math.max(0, Math.min(x, vw - w));
        y = Math.max(0, Math.min(y, vh - h));
        return [x, y];
    }

    el.addEventListener('pointerdown', function(e) {
        if (e.target.closest('input, select, textarea, a, button, [role="button"]')) return;
        startX = e.clientX;
        startY = e.clientY;
        origLeft = el.offsetLeft;
        origTop = el.offsetTop;
        isDragging = false;
        el.setPointerCapture(e.pointerId);

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onEnd);
        el.addEventListener('pointercancel', onEnd);
    });

    function onMove(e) {
        var x = e.clientX, y = e.clientY;
        var dx = x - startX, dy = y - startY;
        if (!isDragging) {
            if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
            isDragging = true;
            wasDragged = true;
            el.classList.add('aplayer-is-dragging');
        }
        var pos = clamp(origLeft + dx, origTop + dy);
        el.style.left = pos[0] + 'px';
        el.style.top = pos[1] + 'px';
    }

    function onEnd() {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onEnd);
        el.removeEventListener('pointercancel', onEnd);
        el.classList.remove('aplayer-is-dragging');
        if (isDragging) {
            isDragging = false;
            setTimeout(function() { wasDragged = false; }, 0);
        }
    }

    el.addEventListener('click', function(e) {
        if (wasDragged) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    window.addEventListener('resize', function() {
        var pos = clamp(el.offsetLeft, el.offsetTop);
        el.style.left = pos[0] + 'px';
        el.style.top = pos[1] + 'px';
    });
})();

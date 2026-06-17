(function () {
    function setup() {
        var header = document.querySelector('#post-toc .trm-post-toc-header');
        if (!header || header._touchDrag) return;
        header._touchDrag = true;

        var toc = document.getElementById('post-toc');
        var startX, startY, origX, origY, dragging = false;

        header.addEventListener('touchstart', function (e) {
            if (!toc.classList.contains('fixed')) return;
            var t = e.touches[0];
            var rect = toc.getBoundingClientRect();
            startX = t.clientX;
            startY = t.clientY;
            origX = rect.left;
            origY = rect.top;
            dragging = true;
        }, { passive: true });

        header.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            e.preventDefault();
            var t = e.touches[0];
            toc.style.left = (origX + t.clientX - startX) + 'px';
            toc.style.top = (origY + t.clientY - startY) + 'px';
            toc.style.right = 'unset';
            toc.style.bottom = 'unset';
            toc.style.opacity = '.6';
        }, { passive: false });

        header.addEventListener('touchend', function () {
            if (!dragging) return;
            dragging = false;
            toc.style.removeProperty('opacity');
        });
    }

    setup();
    document.addEventListener('swup:contentReplaced', setup);
})();

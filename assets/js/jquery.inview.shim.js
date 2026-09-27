/* -----------------------------------------------------------------
 * Scroll-into-view helper
 *
 * jquery.inview.min.js shipped with this template registered a jQuery
 * 'inview' special event through internals that jQuery 3 removed, so
 * the event never fired and three scroll-triggered animations stayed
 * dead: the fact counters, the skill progress bars and the
 * easyPieChart rings.
 *
 * window.onInView(el, cb) replaces it. cb is called with
 * (visible, partX, partY), matching the old event arguments, and only
 * the first time the element scrolls into view - which is what every
 * caller here wants.
 * ----------------------------------------------------------------- */
(function (window, document) {
    'use strict';

    var records = [];
    var byElement = [];

    function partOf(rect) {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var x = (rect.left <= 0 && rect.right >= vw) ? 'both'
              : (rect.left <= 0 ? 'left' : (rect.right >= vw ? 'right' : 'none'));
        var y = (rect.top <= 0 && rect.bottom >= vh) ? 'both'
              : (rect.top <= 0 ? 'top' : (rect.bottom >= vh ? 'bottom' : 'none'));
        return [x, y];
    }

    function fire(el) {
        var rec = byElement.indexOf(el);
        if (rec === -1 || records[rec].fired) return;
        records[rec].fired = true;
        var parts = partOf(el.getBoundingClientRect());
        var cbs = records[rec].callbacks.slice();
        for (var i = 0; i < cbs.length; i++) {
            cbs[i](true, parts[0], parts[1]);
        }
    }

    var hasIO = typeof window.IntersectionObserver === 'function';
    var io = hasIO ? new window.IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) fire(entries[i].target);
        }
    }, { threshold: 0.15 }) : null;

    window.onInView = function (el, cb) {
        if (!el || el.nodeType !== 1) return;

        var idx = byElement.indexOf(el);
        if (idx === -1) {
            idx = records.length;
            records.push({ fired: false, callbacks: [] });
            byElement.push(el);
        }

        records[idx].callbacks.push(cb);

        if (records[idx].fired) return;          // already triggered
        if (io) {
            io.observe(el);
        } else {
            // No IntersectionObserver: fire on the next tick so the
            // final value is always reached rather than stuck at 0.
            setTimeout(function () { fire(el); }, 0);
        }
    };
})(window, document);

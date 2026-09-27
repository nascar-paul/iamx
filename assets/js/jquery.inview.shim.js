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
 *
 * This uses a scroll/resize listener rather than IntersectionObserver
 * on purpose: IO depends on a rendering-path callback that is not
 * reliably delivered in every environment (headless browsers, some
 * embedded webviews), and a missed first callback would leave the
 * counters stuck at 0. There are only three watched elements, so the
 * cost of a getBoundingClientRect per scroll is negligible.
 * ----------------------------------------------------------------- */
(function (window, document) {
    'use strict';

    var records = [];
    var byElement = [];
    var ticking = false;
    var poll = null;

    function partOf(rect) {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var x = (rect.left <= 0 && rect.right >= vw) ? 'both'
              : (rect.left <= 0 ? 'left' : (rect.right >= vw ? 'right' : 'none'));
        var y = (rect.top <= 0 && rect.bottom >= vh) ? 'both'
              : (rect.top <= 0 ? 'top' : (rect.bottom >= vh ? 'bottom' : 'none'));
        return [x, y];
    }

    function fire(rec) {
        if (rec.fired) return;
        rec.fired = true;
        var parts = partOf(rec.el.getBoundingClientRect());
        var cbs = rec.callbacks.slice();
        for (var i = 0; i < cbs.length; i++) {
            cbs[i](true, parts[0], parts[1]);
        }
        // Stop watching elements that have already run.
        var idx = byElement.indexOf(rec.el);
        if (idx > -1) byElement.splice(idx, 1);
    }

    function check() {
        ticking = false;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        // Snapshot first: firing mutates byElement underneath the loop.
        var pending = byElement.slice();
        for (var i = 0; i < pending.length; i++) {
            var el = pending[i];
            var rect = el.getBoundingClientRect();
            if (rect.top < vh * 0.85 && rect.bottom > 0) {
                var idx = byElement.indexOf(el);
                if (idx > -1) fire(records[idx]);
            }
        }
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        (window.requestAnimationFrame || window.setTimeout)(check, 16);
    }

    // Scroll events are not delivered in every environment (headless
    // browsers, some embedded webviews) even though the scroll position
    // changes, so keep a slow interval running until everything pending
    // has fired. It stops itself once there is nothing left to watch.
    function startPoll() {
        if (poll) return;
        poll = window.setInterval(function () {
            check();
            if (byElement.length === 0 && poll) {
                window.clearInterval(poll);
                poll = null;
            }
        }, 300);
    }

    window.onInView = function (el, cb) {
        if (!el || el.nodeType !== 1) return;

        var idx = byElement.indexOf(el);
        if (idx === -1) {
            idx = records.length;
            records.push({ el: el, fired: false, callbacks: [] });
            byElement.push(el);
        }

        records[idx].callbacks.push(cb);
        if (records[idx].fired) return;   // already triggered

        if (byElement.length === 1) {
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            startPoll();
        }
        check();
    };
})(window, document);

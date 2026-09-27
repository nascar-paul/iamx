/* -----------------------------------------------------------------
 * jQuery inview shim
 *
 * jquery.inview.min.js shipped with this template registers its
 * special event through jQuery 1.x internals that jQuery 3 removed,
 * so the 'inview' event never fired and every scroll-triggered
 * animation below (fact counters, skill progress bars, pie charts)
 * stayed dead. This re-implements the same event on top of
 * IntersectionObserver.
 *
 * The event signature is unchanged - callbacks receive
 * (event, visible, visiblePartX, visiblePartY) - so scripts.js
 * needed no changes.
 * ----------------------------------------------------------------- */
(function (window, $) {
    'use strict';
    if (!$) return;

    var SPECIAL = 'inview';
    var observed = [];
    var fired = [];

    var supported = ('IntersectionObserver' in window);
    var io = supported ? new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting || fired.indexOf(entry.target) > -1) return;
            fired.push(entry.target);
            var parts = visiblePart(entry.boundingClientRect);
            $(entry.target).trigger(SPECIAL, [true, parts[0], parts[1]]);
        });
    }, { threshold: 0.15 }) : null;

    function visiblePart(rect) {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var x = (rect.left <= 0 && rect.right >= vw) ? 'both'
              : (rect.left <= 0 ? 'left' : (rect.right >= vw ? 'right' : 'none'));
        var y = (rect.top <= 0 && rect.bottom >= vh) ? 'both'
              : (rect.top <= 0 ? 'top' : (rect.bottom >= vh ? 'bottom' : 'none'));
        return [x, y];
    }

    function observe(el) {
        if (observed.indexOf(el) > -1) return;
        observed.push(el);
        if (io) {
            io.observe(el);
        } else {
            // No IntersectionObserver: fire immediately so content is
            // never left permanently un-animated.
            var parts = visiblePart(el.getBoundingClientRect());
            setTimeout(function () { $(el).trigger(SPECIAL, [true, parts[0], parts[1]]); }, 0);
        }
    }

    $.event.special = $.event.special || {};

    $.event.special[SPECIAL] = $.event.special[SPECIAL] || {};

    // setup() runs at .bind() time, which is when we learn which
    // element wants the event. Observing here rather than on document
    // ready matters: this file loads before scripts.js, so a ready
    // callback would run before any handler is bound.
    $.event.special[SPECIAL].setup = function (data, namespaces, eventHandle) {
        var el = eventHandle ? eventHandle : this;
        if (el && el.nodeType === 1) observe(el);
    };

    $.event.special[SPECIAL].teardown = function () {
        // jQuery removes its own handlers; nothing to clean up.
    };
})(window, window.jQuery);

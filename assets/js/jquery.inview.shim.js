/* -----------------------------------------------------------------
 * jQuery inview shim
 *
 * jquery.inview.min.js shipped with this template registers its
 * special event using jQuery 1.x internals that no longer exist in
 * jQuery 3, so the 'inview' event never fired and every scroll-triggered
 * animation below (fact counters, skill bars, pie charts) stayed dead.
 * This re-implements the same event on top of IntersectionObserver.
 * ----------------------------------------------------------------- */
(function (window, $) {
    'use strict';
    if (!$) return;

    var SPECIAL = 'inview';

    // Expose the special event so $(sel).unbind('inview') and the
    // add/remove bookkeeping the old plugin relied on keep working.
    $.event.special = $.event.special || {};
    var existing = $.event.special[SPECIAL] || {};
    var handlers = [];

    $.event.special[SPECIAL] = $.event.special[SPECIAL] || {};

    $.event.special[SPECIAL].setup = function (data, namespaces, eventHandle) {
        var $el = eventHandle ? $(eventHandle) : $(this);
        handlers.push({ el: $el[0], $el: $el, ns: namespaces });
    };
    $.event.special[SPECIAL].teardown = function (namespaces) {
        // jQuery removes handlers for us; nothing to clean.
    };

    function visiblePart(el, rect) {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right;
        return [
            (left <= 0 && right >= vw) ? 'both' : (left <= 0 ? 'left' : (right >= vw ? 'right' : 'none')),
            (top <= 0 && bottom >= vh) ? 'both' : (top <= 0 ? 'top' : (bottom >= vh ? 'bottom' : 'none'))
        ];
    }

    if (!('IntersectionObserver' in window)) {
        // No observer: fire for everything immediately so content is
        // never left permanently un-animated.
        $(function () {
            handlers.forEach(function (h) {
                h.$el.trigger(SPECIAL, [true, 'both', 'both']);
            });
        });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var parts = visiblePart(el, entry.boundingClientRect);
            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i].el === el) {
                    handlers[i].$el.trigger(SPECIAL, [true, parts[0], parts[1]]);
                }
            }
        });
    }, { threshold: 0.15 });

    // Observe on the next tick, once the handler bindings from
    // scripts.js's document-ready block are in place.
    $(function () {
        handlers.forEach(function (h) {
            io.observe(h.el);
        });
    });
})(window, window.jQuery);

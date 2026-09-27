/*
Theme Name: IAMX
Author: Ahmed Faruk
Author URL: farukahmed.com
*/

/*
    = Preloader
    = Animated scrolling / Scroll Up
    = Full Screen Slider
    = Sticky Menu
    = Back To Top
    = Countup
    = Progress Bar
    = More skill
    = Shuffle
    = Magnific Popup
    = Vidio auto play
    = Fit Vids
    = Google Map

*/

jQuery(function ($) {

    'use strict';

    /* ---------------------------------------------- /*
     * Preloader
    /* ---------------------------------------------- */

    // Was $(window).ready(...), which throws on jQuery 3 - window has no
    // ready() method - and aborted the whole ready handler, leaving the
    // countup, progress bar and pie chart blocks below unexecuted.
    $('#pre-status').fadeOut();
    $('#tt-preloader').delay(350).fadeOut('slow');




    // -------------------------------------------------------------
    // Animated scrolling / Scroll Up
    // -------------------------------------------------------------

    (function () {
        $('a[href*=#]').bind("click", function(e){
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top
            }, 1000);
            e.preventDefault();
        });
    }());



    // -------------------------------------------------------------
    // Full Screen Slider
    // -------------------------------------------------------------
    (function () {
        $(".tt-fullHeight").height($(window).height());

        $(window).resize(function(){
            $(".tt-fullHeight").height($(window).height());
        });

    }());


    // -------------------------------------------------------------
    // Sticky Menu
    // -------------------------------------------------------------

    (function () {
        $('.header').sticky({
            topSpacing: 0
        });

        $('body').scrollspy({
            target: '.navbar-custom',
            offset: 70
        })
    }());




    // -------------------------------------------------------------
    // Back To Top
    // -------------------------------------------------------------

    (function () {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scroll-up').fadeIn();
            } else {
                $('.scroll-up').fadeOut();
            }
        });
    }());


    // -------------------------------------------------------------
    // Countup
    // Reads the target from data-to, not the element's own text. The
    // markup ships "0" as the starting value, so animating to
    // $this.text() counted 0 -> 0 and the numbers never moved.
    // -------------------------------------------------------------
    $('.count-wrap').each(function () {
        var $wrap = $(this);
        window.onInView(this, function (visible) {
            if (visible) {
                $wrap.find('.timer').each(function () {
                    var $this = $(this);
                    var target = parseInt($this.attr('data-to'), 10) || 0;
                    $this.text(0);
                    $({ Counter: 0 }).animate({ Counter: target }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function () {
                            $this.text(Math.ceil(this.Counter));
                        },
                        complete: function () {
                            $this.text(target);
                        }
                    });
                });
            }
        });
    });


    // -------------------------------------------------------------
    // Progress Bar
    // -------------------------------------------------------------
 
    $('.skill-progress').each(function () {
        window.onInView(this, function (visible) {
            if (visible) {
                $.each($('div.progress-bar'),function(){
                    $(this).css('width', $(this).attr('aria-valuenow')+'%');
                });
            }
        });
    });
    
    // -------------------------------------------------------------
    // More skill
    // -------------------------------------------------------------
    $('.more-skill').each(function () {
        window.onInView(this, function (visible) {
            if (visible) {
                $('.chart').easyPieChart({
                    //your configuration goes here
                    easing: 'easeOut',
                    delay: 3000,
                    barColor: '#68c3a3',
                    trackColor: 'rgba(255,255,255,0.2)',
                    scaleColor: false,
                    lineWidth: 8,
                    size: 140,
                    animate: 2000,
                    onStep: function (from, to, percent) {
                        this.el.children[0].innerHTML = Math.round(percent);
                    }
                });
            }
        });
    });


    // -------------------------------------------------------------
    // Shuffle
    // -------------------------------------------------------------

    (function () {

        var $grid = $('#grid');

        $grid.shuffle({
            itemSelector: '.portfolio-item'
        });

        /* reshuffle when user clicks a filter item */
        $('#filter a').click(function (e) {
            e.preventDefault();

            // set active class
            $('#filter a').removeClass('active');
            $(this).addClass('active');

            // get group name from clicked item
            var groupName = $(this).attr('data-group');

            // reshuffle grid
            $grid.shuffle('shuffle', groupName );
        });


    }());


    // -------------------------------------------------------------
    // Magnific Popup
    // -------------------------------------------------------------

    (function () {
      $('.image-link').magnificPopup({

        gallery: {
          enabled: true
        },
        removalDelay: 300, // Delay in milliseconds before popup is removed
        mainClass: 'mfp-with-zoom', // this class is for CSS animation below
        type:'image'

      });

    }());



    // -------------------------------------------------------------
    // Fit Vids
    // -------------------------------------------------------------
    (function () {
        $(".video-container").fitVids();
    }());



    // -------------------------------------------------------------
    // Video autoplay — removed. Used the Vimeo Froogaloop API via
    // http://a.vimeocdn.com/js/froogaloop2.min.js, which is blocked
    // as mixed content on HTTPS. The #nofocusvideo element it targeted
    // no longer exists, so $f() was called on null and threw.
    // The modal video still plays via the native YouTube iframe.
    // -------------------------------------------------------------




    // -------------------------------------------------------------
    // STELLAR FOR BACKGROUND SCROLLING
    // -------------------------------------------------------------

    $(window).load(function() {

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
         
        }else {
            $.stellar({
                horizontalScrolling: false,
                responsive: true
            });
        }

    });


    // -------------------------------------------------------------
    // WOW JS
    // -------------------------------------------------------------

    (function () {

        new WOW({

            mobile:  false

        }).init();

    }());

    // -------------------------------------------------------------
    // Google Map
    // -------------------------------------------------------------

    (function () {
        var myLatlng = new google.maps.LatLng(41.372641, -74.687387);

            var styles = [
                {
                    featureType: "landscape",
                    stylers: [
                        { color: '#f7f7f7' }
                    ]
                },{
                    featureType: "natural",
                    stylers: [
                        { hue: '#00ffe6' }
                    ]
                },{
                    featureType: "road",
                    stylers: [
                        { hue: '#fff' },
                        { saturation: -70 }
                    ]
                },{
                    featureType: "building",
                    elementType: "labels",
                    stylers: [
                        { hue: '' }
                    ]
                },{
                    featureType: "poi", //points of interest
                    stylers: [
                        { hue: '' }
                    ]
                }
            ];

            var mapOptions = {
                zoom: 15,
                scrollwheel: false,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                styles: styles
            }
            var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: 'Hello World!'
            });

            var contentString = '' +
                    '' +
                    '';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

    }());


});






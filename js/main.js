jQuery(document).ready(function () {

//Preloader active
    jQuery(window).load(function () {
        jQuery(".loaded").fadeOut();
        jQuery(".preloader").delay(1000).fadeOut("slow");
    });

// sidenav navbar nav
    jQuery(".button-collapse").sideNav();


// localScroll js
    jQuery(".navbar-desktop").localScroll();

// Counter 
    jQuery('.statistic-counter').counterUp({
        delay: 10,
        time: 2000
    });

// Mixitube
    jQuery('#mixcontent').mixItUp({
        animation: {
            animateResizeContainer: false,
            effects: 'fade rotateX(-45deg) translateY(-10%)'
        }
    });

// MagnificPopup
    jQuery('.gallery-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        },
    });

// Home slider
    jQuery('.slider').slider({full_width: true});

// client slider
    jQuery('.carousel').carousel();

// accordion

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
    
// nav menu small menu
    jQuery(document).on("scroll", function () {
        if ($(document).scrollTop() > 120) {
            $("nav").addClass("small");
        } else {
            $("nav").removeClass("small");
        }
    });


});









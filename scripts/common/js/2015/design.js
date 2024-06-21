$(document).ready(function() {
	
	// BOOTSTRAP PRELOADER
	$(window).load(function() {
		$(".spinner").delay(1000).fadeOut('slow');
		$("#mask").delay(1500).slideUp(600);
	});
	// BOOTSTRAP CLOSE NAVBAR ON CLICK
	$('#nav a').on('click', function() {
		if ($(window).width() < 768) {
		$(".navbar-toggle").click();
		}
	});
	
	// BOOTSTRAP PARALLAX SECTIONS
	$('.parallax-section').each(function() {
		$(this).parallax("100%", 0.1);
	});
	// BOOTSTRAP BACKGROUND IMAGES
	$('#backgrounds img').each(function() {
		var image = $(this).attr('src');
		$(this).parents('li').css('background-image', 'url('+image+')');
		$(this).remove();
	});
	
	// BOOTSTRAP ELEMENTS ANIMATION
	$('.animated').appear(function() {
		var element = $(this);
		var animation = element.data('animation');
		var animationDelay = element.data('animation-delay');
		if (animationDelay) {
			setTimeout(function(){
			element.addClass( animation + " visible" );
		}, animationDelay);
		} else {
			element.addClass( animation + " visible" );
		}
	},{accY: -150});
	// BOOTSTRAP ACCORDION IMAGE SWAP
	$(".collapse").on("shown.bs.collapse", function() {
        $(this).parent().find(".fa-chevron-right:first").removeClass("fa-chevron-right").addClass("fa-chevron-down");
    }).on("hidden.bs.collapse", function()
    {
        $(this).parent().find(".fa-chevron-down:first").removeClass("fa-chevron-down").addClass("fa-chevron-right");
    });
	
	// BOOTSTRAP SMOOTH PAGE SCROLL
	$(function() {
		$('a.page-scroll').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	});
	// JQUERY FANCYBOX
	$("a.fancybox").fancybox({
		type:'iframe',
		iframe: { scrolling: 'yes' },
		openEffect:'elastic',
		closeEffect:'elastic',
		width:1000,
		height:'95%',
		maxHeight:'95%',
		maxWidth:'95%',
		overlayColor:'#000',
		overlayOpacity:0.5,
		helpers: { 
			overlay: { fixed:false } 
		}
	});
	
	// JQUERY TO TOP OF PAGE
	$().UItoTop({ easingType: 'easeOutQuart' });
    $('[data-toggle="tooltip"]').tooltip();
	//JQUERY POPOVER
	$( window ).load( function() {
		$('[data-toggle="popover"]').popover({ delay: {show: 500, hide: 100 }});
	});
	
});
// Global screen width
var screenWidth;

// Variables to condense nav on scroll up/down
var scrollThresholdToMinimizeNav = 50;
var scrollingDown = true;
var scrollPosition;
var startingScrollPosition;
var scrollThresholdStartPosition;

jQuery(document).ready(function() {
	screenWidth = jQuery(window).width();
	
	// Megamenu trigger
	jQuery('.main-nav ul li').hover(function() {
		jQuery('.megamenu').removeClass('active').removeClass('animate-in');
		
		var targetMegamenu = '.megamenu.' + jQuery(this).data('megamenu');
		jQuery(targetMegamenu).addClass('active');
		setTimeout(function() {
//			console.log('actived');
			jQuery(targetMegamenu).addClass('animate-in');
		}, 5);
		
		// Dynamic background height
		jQuery('.megamenu.megamenu-dynamic-background').addClass('active');
		jQuery('.megamenu.megamenu-dynamic-background').height(jQuery(targetMegamenu).height());
		// console.log('.megamenu.' + jQuery(this).data('megamenu'));
	});
	
	jQuery('.main-nav ul li').mouseout(function() {
		if (jQuery('.megamenu:hover').length == 0) {
			jQuery('.megamenu').removeClass('active').removeClass('animate-in');
		
			jQuery('.megamenu.megamenu-dynamic-background').height(0);
		}
	});
	
	jQuery('.megamenu').mouseleave(function() {
		jQuery('.megamenu').removeClass('active').removeClass('animate-in');
		
		jQuery('.megamenu.megamenu-dynamic-background').height(0);
	});
	
	// Mobile navigation
	jQuery('.mobile-nav-open').click(function() {
		jQuery('.mobile-nav').addClass('active');
		jQuery('html, body').addClass('scroll-lock');
	});
	
	jQuery('.mobile-nav-close').click(function() {
		jQuery('.mobile-nav').removeClass('active');
		jQuery('html, body').removeClass('scroll-lock');
	});
	
	jQuery('.mobile-nav-fade').mousedown(function() {
		jQuery('.mobile-nav').removeClass('active');
		jQuery('html, body').removeClass('scroll-lock');
	});
	
	// Desktop search functionality
	jQuery('#search_header svg').click(function(event) {
		if (!jQuery('#search_header form').hasClass('active')) {
			event.preventDefault();
			jQuery('#search_header form').addClass('active');
			jQuery('#search_header form > input').focus();
		}
	});
	
	jQuery('html, body, header').mousedown(function(event) {
		if (!jQuery(event.target).is('#search_header') && !jQuery(event.target).is('#search_header form > input') && !jQuery(event.target).is('#search_header form svg')) {
			jQuery('#search_header form').removeClass('active');
		}
	});
	
	// Dark Mode CSS Transition Manager
	const transitionManager = () => {
		// Create HTML style element with CSS selector that targets all
		// elements and applies CSS to disable transitions
		const style = document.createElement("style");
		const css = document.createTextNode(`* {
			-webkit-transition: none !important;
			-moz-transition: none !important;
			-o-transition: none !important;
			-ms-transition: none !important;
			transition: none !important;
		}`);
		style.appendChild(css);

		// Create functions for adding and remove the style element from
		// the page <head> tag
		const enable = () => document.head.removeChild(style);
		const disable = () => document.head.appendChild(style);
		return {enable, disable, style};
	};
	// Dark Mode Set
	if (getCookie('data-theme')) {
		jQuery('html').attr('data-theme', getCookie('data-theme'));
		// Set PHP dark mode preference
		jQuery.ajax({
			type: "POST",
			url: "/wp-content/themes/campus-theme/js/ajax-js-dark-mode-toggle.php?3",
			data: {"data-theme": getCookie('data-theme')}
		});
	}
	// Dark Mode Toggle
	jQuery('.dark-mode-toggle').click(function() {
		var $dataTheme;
		if (jQuery('html').attr('data-theme') == 'light') {
			$dataTheme = 'dark';
		} else {
			$dataTheme = 'light';
		}
		
		const transitions = transitionManager();
		// Disable CSS transitions
		transitions.disable();
		// Toggle dark mode
		jQuery('html').attr('data-theme', $dataTheme);
		// Enable CSS transitions after the browsers UI refreshes
		window.requestAnimationFrame(transitions.enable);
		
		// Set dark mode preference for 90 days
		optionsSet('data-theme', $dataTheme, 90);
		// Set PHP dark mode preference
		jQuery.ajax({
			type: "POST",
			url: "/wp-content/themes/campus-theme/js/ajax-js-dark-mode-toggle.php?3",
			data: {"data-theme": $dataTheme}
		});
	});
	
	// Set initial scroll values on page load
	scrollPosition = jQuery(window).scrollTop();
	startingScrollPosition = jQuery(window).scrollTop();
	scrollThresholdStartPosition = jQuery(window).scrollTop();
	
	// YouTube Course Popout
	UpdateYouTubeCoursePopout();
	
	// Pillar Carousel functions
	if (jQuery('#pillar-carousel').length) {
		
		if (screenWidth < 992) {
			jQuery('#pillar-carousel').carousel({
				interval: false,
				ride: false
			});
		}
		
		var pillarCarousel = jQuery('#pillar-carousel');

		pillarCarousel.on('slide.bs.carousel', function (event) {
//			console.log(event);
			jQuery('.pillar-nav').removeClass('active');
			jQuery('.pillar-nav[data-bs-slide-to="' + event.to + '"]').addClass('active');
//			console.log(event.to);
//			console.log('.pillar-nav[data-bs-slide-to="' + event.to + '"]');
		});
	}
	
	if (jQuery('#glossary-shuffle-term').length) {
		glossaryShuffle();
	}
	
	UpdateFredCharts();
});

jQuery(window).scroll(function() {
	scrollPosition = jQuery(window).scrollTop();
	
	// Pillar Carousel functions
	if (jQuery('#pillar-carousel').length) {
		if (screenWidth < 992) {
			jQuery('#pillar-carousel').carousel({
				interval: false,
				ride: false
			});
		} else {
			var carouselInterval = jQuery('#pillar-carousel').data('bs-interval');
			jQuery('#pillar-carousel').carousel({
				interval: carouselInterval,
				ride: 'carousel'
			});
		}
	}
	
	// YouTube Course Popout
	UpdateYouTubeCoursePopout();
	
	// Header functions
	// Check if the user is scrolling up or down
	if (scrollPosition < startingScrollPosition) {
		if (scrollingDown) {
			scrollThresholdStartPosition = scrollPosition;
		}
		
		scrollingDown = false;
	} else {
		if (!scrollingDown) {
			scrollThresholdStartPosition = scrollPosition;
		}
		
		scrollingDown = true;
	}
	
	startingScrollPosition = scrollPosition;
	
	// If the user is past the scroll threshold in the direction they're scrolling add or remove the 'condensed' class to the header
	if (scrollingDown) {
		if (Math.abs(scrollPosition - scrollThresholdStartPosition) > scrollThresholdToMinimizeNav) {
			jQuery('header.global').addClass('condensed');
			
			if (jQuery('header.pillar').length) {
				jQuery('header.pillar').addClass('condensed');
			}
		}
	} else {
		if (Math.abs(scrollPosition - scrollThresholdStartPosition) > scrollThresholdToMinimizeNav) {
			
			// Redoc exception - revise
			if (!jQuery('body').hasClass('postid-195580')) {
			
				if (jQuery('header.pillar').length) {
					jQuery('header.pillar').removeClass('condensed');
				} else {
					jQuery('header.global').removeClass('condensed');
				}
				
			} else {
				
				if (scrollPosition < 215) {
					if (jQuery('header.pillar').length) {
						jQuery('header.pillar').removeClass('condensed');
					} else {
						jQuery('header.global').removeClass('condensed');
					}
				}
				
			}
		}
	}
	
	// Debug values
//	console.log('------------');
//	console.log('scrolling down: ' + scrollingDown);
//	console.log('starting scroll position: ' + startingScrollPosition);
//	console.log('scroll position: ' + scrollPosition);
//	console.log('scroll threshold start position: ' + scrollThresholdStartPosition);
//	console.log('difference: ' + Math.abs(scrollPosition - startingScrollPosition));
});

jQuery(window).resize(function() {
	screenWidth = jQuery(window).width();
	
	// Remove scroll lock when resizing to desktop if mobile menu is open
	if (screenWidth >= 992) {
		if (!jQuery('header.global').hasClass('api-condensed')) {
			jQuery('.mobile-nav').removeClass('active');
			jQuery('html, body').removeClass('scroll-lock');
		}
	} else {
		jQuery('.megamenu').removeClass('active');
	}
	
	// Clear megamenus if resizing to mobile menu screen width
	if (jQuery('.megamenu.active').length > 0) {
		jQuery('.megamenu.megamenu-dynamic-background').height(jQuery('.megamenu.active:not(.megamenu-dynamic-background)').height());
	}
	
	// YouTube Course Popout
	UpdateYouTubeCoursePopout();
	
	UpdateFredCharts();
});

// Fred Charts
var updateFredChartsTimeout;
function UpdateFredCharts() {
	if (jQuery('.fred-iframe').length) {
		clearTimeout(updateFredChartsTimeout);
		updateFredChartsTimeout = setTimeout(function() {
			jQuery('.fred-iframe iframe').each(function() {
				var parentDivWidth = jQuery(this).parent('div').innerWidth();
				var src = jQuery(this).attr('src');
				src = new URL(src);
				src.searchParams.set('width', parentDivWidth);
				jQuery(this).attr('src', src);
				jQuery(this).width(parentDivWidth);
				//jQuery(this).location.reload();
			});
		}, 150);
	}
}

// TA YouTube popout on scroll
var openYouTube = true;
var youTubeVideoTop;
var youTubeMobileBreakpoint = 768;
function UpdateYouTubeCoursePopout() {
	// Exit if the YouTube popout doesn't exist
	if (!jQuery('.youtube-course-popout').length) {
		return false;
	}
	
	// Set vertical breakpoint for popping out video
	if (screenWidth < youTubeMobileBreakpoint) {
		youTubeVideoTop = parseInt(jQuery('.youtube-course-popout').parent().offset().top - 100);
	} else {
		youTubeVideoTop = parseInt(jQuery('.youtube-course-popout').parent().offset().top + jQuery('.youtube-course-popout').parent().height() - 100 );
	}
	
	jQuery('#youtube-course-popout-close').click(function() {
		openYouTube = false;
		jQuery('.youtube-course-popout').removeClass('active');
	});

	if (scrollPosition > youTubeVideoTop) {
		if (!jQuery('.youtube-course-popout').hasClass('active')) {
			if (openYouTube) {
				jQuery('.youtube-course-popout').addClass('active');
				if (screenWidth >= youTubeMobileBreakpoint) {
					jQuery('.youtube-course-popout').hide();
					jQuery('.youtube-course-popout').fadeIn(300);
				}
			}
		}
	} else {
		openYouTube = true;
		if (jQuery('.youtube-course-popout').hasClass('active')) {
			jQuery('.youtube-course-popout').removeClass('active');
			if (screenWidth >= youTubeMobileBreakpoint) {
				jQuery('.youtube-course-popout').hide();
				jQuery('.youtube-course-popout').fadeIn(300);
			}
		}
	}
}

// Glossary AJAX functions
function glossaryLiveSearch(str, liveSearchID) {
	if (str.length == 0) {
		document.getElementById(liveSearchID).innerHTML = "";
		//document.getElementById("livesearch").style.border = "0px";
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	if (str.length > 1) {
		document.getElementById(liveSearchID).innerHTML = "<p>Loading...</p>";
	}
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(liveSearchID).innerHTML = this.responseText;
			//document.getElementById("livesearch").style.border = "1px solid #A5ACB2";
		}
	}
	xmlhttp.open("GET", "/wp-content/themes/campus-theme/inc/common/glossary-search.php?q=" + str, true);
	xmlhttp.send();
}

// Stock Ticker Search AJAX functions
function stockLiveSearch(str, liveSearchID) {
	if (str.length == 0) {
		document.getElementById(liveSearchID).innerHTML = "";
		//document.getElementById("livesearch").style.border = "0px";
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	if (str.length > 1) {
		document.getElementById(liveSearchID).innerHTML = "<p>Loading stocks...</p>";
	}
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(liveSearchID).innerHTML = this.responseText;
			//document.getElementById("livesearch").style.border = "1px solid #A5ACB2";
		}
	}
	xmlhttp.open("GET", "/wp-content/themes/campus-theme/inc/common/stock-search.php?q=" + str, true);
	xmlhttp.send();
}

function glossaryShuffle() {
	var xmlhttp = new XMLHttpRequest();
	// Swap out previous term with loading wheel
	document.getElementById('glossary-shuffle-term').innerHTML = '<div class="loading white"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.1487 20.116C35.1487 11.8616 28.4575 5.16962 20.2023 5.16962C11.9479 5.16962 5.25586 11.8616 5.25586 20.116H8.51026C8.51026 13.6592 13.7447 8.42402 20.2023 8.42402C26.6599 8.42402 31.8943 13.6584 31.8943 20.116H35.1487Z" fill="#000"/></svg></div>';
	document.getElementById('glossary-shuffle').style.display = 'none';
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Populate new term
			document.getElementById('glossary-shuffle-term').innerHTML = this.responseText;
			document.getElementById('glossary-shuffle').style.display = 'flex';
		}
	}
	xmlhttp.open("POST", "/wp-content/themes/campus-theme/inc/common/glossary-shuffle.php", true);
	xmlhttp.send();
}

// search box in header script
/*
var searchBox = document.getElementById("search_header");
var openSearch = document.getElementById("search_default");
document.onclick = function(e){
	if(e.target === openSearch){
	setTimeout(function () {
	searchBox.classList.add("search-header-on");
	searchBox.classList.remove("search-header-off");
	openSearch.classList.remove("search-default-on");
	openSearch.classList.add("search-default-off");
	document.getElementById("s").focus();
	}, 0);
	}
	if (!searchBox.contains(e.target)){
	searchBox.classList.remove("search-header-on");
	searchBox.classList.add("search-header-off");
	openSearch.classList.remove("search-default-off");
	openSearch.classList.add("search-default-on");
	}
};
*/

// get site JSON url
var WpJsonUrl = document.querySelector('link[rel="https://api.w.org/"]').href;
// take out the '/wp-json/' and 'https:' part
var WpRemoveURL = WpJsonUrl.replace('/wp-json/','');
var thisSiteURL = WpRemoveURL.replace('https://','');

// cookie manage pop up settings
document.getElementById('cookieForm').addEventListener('submit', function (e) {
e.preventDefault();

//////set up performance cookie
var performanceRadio = document.querySelectorAll('input[name="performance"]');
var performanceValue = null;
for (var i = 0; i < performanceRadio.length; i++) {
	if (performanceRadio[i].checked) {
	performanceValue = performanceRadio[i].value;
	break;
	}
}
if (performanceValue === 'yes') {
	gdprOptIn();
} else if (performanceValue === 'no') {
	gdprOptOut();
} else {
	// do nothing
}

// set up functional cookie
var functionalRadio = document.querySelectorAll('input[name="functional"]');
var functionalValue = null;
for (var i = 0; i < functionalRadio.length; i++) {
	if (functionalRadio[i].checked) {
	functionalValue = functionalRadio[i].value;
	break;
	}
}
if (functionalValue === 'yes') {
	// can't opt into options cookie until user sees the ODD popup.
	// optionsOptIn();
} else if (functionalValue === 'no') {
	optionsOptOut();
} else {
	// do nothing
}

//set up marketing cookie
var marketingRadio = document.querySelectorAll('input[name="marketing"]');
var marketingValue = null;
for (var i = 0; i < marketingRadio.length; i++) {
	if (marketingRadio[i].checked) {
	marketingValue = marketingRadio[i].value;
	break;
	}
}
if (marketingValue === 'yes') {
	mktngOptIn();
} else if (marketingValue === 'no') {
	mktngOptOut();
} else {
	// do nothing
}
});
// END cookie manager pop up settings

////// cookie function calls
function optInAll() { 
	if (/(^|;)\s*IBKRcampus_gdpr_optOut/.test(document.cookie)) {
	deleteCookie('IBKRcampus_gdpr_optOut');
	}
	gdprSet('IBKRcampus_gdpr_optIn', 'true', 3650);	
	gdprSet('IBKRcampus_mktng_optIn', 'true', 3650);
	
	window.setTimeout(function () {
       location.reload();
    }, .5);
}

function optOutAll() { 
	if (/(^|;)\s*IBKRcampus_gdpr_optIn/.test(document.cookie)) {
	deleteCookie('IBKRcampus_gdpr_optIn');
	}
	gdprSet('IBKRcampus_gdpr_optOut', 'true', 2);
	
	if (/(^|;)\s*IBKRcampus_options_optIn/.test(document.cookie)) {
	deleteCookie('IBKRcampus_options_optIn');
	}
	
	if (/(^|;)\s*IBKRcampus_mktng_optIn/.test(document.cookie)) {
	deleteCookie('IBKRcampus_mktng_optIn');
	}
	window.setTimeout(function () {
       location.reload();
    }, .5);
}

function gdprOptIn() { 
	if (/(^|;)\s*IBKRcampus_gdpr_optOut/.test(document.cookie)) {
	deleteCookie('IBKRcampus_gdpr_optOut');
	}
	gdprSet('IBKRcampus_gdpr_optIn', 'true', 3650);
	window.setTimeout(function () {
       location.reload();
    }, .5);
}

function gdprOptOut() { 
	if (/(^|;)\s*IBKRcampus_gdpr_optIn/.test(document.cookie)) {
	deleteCookie('IBKRcampus_gdpr_optIn');
	}
	gdprSet('IBKRcampus_gdpr_optOut', 'true', 3650);
	window.setTimeout(function () {
       location.reload();
    }, .5);
}

function optionsOptIn() { 
	optionsSet('IBKRcampus_options_optIn', 'true', 3650);
	location.reload();
}

function optionsOptOut() { 
	deleteCookie('IBKRcampus_options_optIn');
	location.reload();
}

function mktngOptIn() { 
	gdprSet('IBKRcampus_mktng_optIn', 'true', 3650);
	location.reload();
}

function mktngOptOut() { 
	deleteCookie('IBKRcampus_mktng_optIn');
	// delete 'web' cookie
	var d = new Date();
	d.setTime(d.getTime() - (1000*60*60*24));
	var expires = "expires=" + d.toGMTString();
	window.document.cookie = 'web'+"="+"; "+expires + ";domain=." + 'interactivebrokers.com' + ";path=/; SameSite=None; Secure";
	
	location.reload();
}

// Subroutines for cookies
// Set GDPR cookie
function gdprSet(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=." + thisSiteURL + ";path=/; SameSite=None; Secure";	
	
	document.getElementById("privacy-bar").classList.add('bar-off');
	document.getElementById("privacy-bar").classList.remove('bar-on');
	
}

// Set Options cookie
function optionsSet(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=." + thisSiteURL + ";path=/; SameSite=None; Secure";
}

// Delete any cookie
function deleteCookie(cname) {
	var d = new Date();
	d.setTime(d.getTime() - (1000*60*60*24));
	var expires = "expires=" + d.toGMTString();
	window.document.cookie = cname+"="+"; "+expires + ";domain=." + thisSiteURL + ";path=/; SameSite=None; Secure";
	//location.reload();
}

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)"); 
	var value = re.exec(document.cookie); 
	return (value != null) ? unescape(value[1]) : null; 
}


function dropdownopen(){
	$('li.dropdown', this).addClass("on");
}


function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    console.log(value);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
  }
  
  function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
  }


(function ($) {
	"use strict"; 
     var $window = $(window);
    if ($("nav.navbar").hasClass("fixed-top")) {
        
		 $window.scroll(function () {	
            var $scroll = $window.scrollTop();
            var $navbar = $(".fixed-top");
            if ($scroll >= 150) {
                $navbar.addClass("fixed-menu");
            } else {
                $navbar.removeClass("fixed-menu");
            }
		});   
    } 

  



    var slides = $('.header-slide');
   
    $('.slick-header').slick({
		arrows: false,
		autoplay: true,
		fade: true,
		slidesToShow: 1,
        slidesToScroll: 1,
        arrows:true,
        prevArrow:'<button type="button" class="slick-prev"><i class="fal fa-arrow-left"></i></button>',
        nextArrow:'<button type="button" class="slick-next"><i class="fal fa-arrow-right"></i></button>',
        autoplaySpeed:5000,
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        slides.find('h2').removeClass('slideInLeft slideInRight');
        slides.find('p').removeClass('slideInLeft slideInRight');
        slides.find('a').removeClass('slideInLeft slideInRight');
        slides.eq(nextSlide).find('h2').addClass('slideInLeft');
        slides.eq(nextSlide).find('p').addClass('slideInLeft');
        slides.eq(nextSlide).find('a').addClass('slideInLeft');
        slides.eq(nextSlide + 1).find('h2').addClass('slideInRight');
        slides.eq(nextSlide + 1).find('p').addClass('slideInRight');
        slides.eq(nextSlide + 1).find('a').addClass('slideInRight');
       // slides.removeClass('slideInLeft slideInRight');
        // use custom transition
        // slides.eq(nextSlide).addClass('slideInLeft');
        // slides.eq(nextSlide + 1).addClass('slideInRight');
      });
    
    
	$('li.dropdown').on('mouseenter', function(){
		dropdownopen();
	});

	/* */
	 

	  var $videoSrc;  
$('.video-content a').click(function() {
	$videoSrc = $(this).data( "src" ); 
});


  
  
// when the modal is opened autoplay it  
$('#myModal').on('shown.bs.modal', function (e) {
    
// set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
$("#video").attr('src',$videoSrc + "?rel=0&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1" ); 
})
  
  
// stop playing the youtube video when I close the modal
$('#myModal').on('hide.bs.modal', function (e) {
    // a poor man's stop video
    $("#video").attr('src',$videoSrc); 
}) 
    
   // Custom Tabs
   $('ul.tabs li').on('click', function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
		$(".responsive").slick("setPosition");
	}) 

	// Slick Slider for Packages

	$('.responsive').slick({
        // dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button">Prev</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        responsive: [{
            breakpoint: 991,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
            infinite: true,
            }

        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                infinite: true,
                arrows: true,
                
            }
        }]
    });

    $('.book').slick({
        // dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button">Prev</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                // centerMode: true,

            }

        }, {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1, 
                infinite: false,

            }


        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                infinite: true,
                arrows: true,
            }
        }]
    });
    
    // closed by rinkesh 26-03-2019
    // $('.book11').slick({
    //     // dots: true,
    //     infinite: true,
    //     speed: 300,
    //     rows: 1,
    //     slidesPerRow:4,
    //     slidesToScroll: 1,
    //     dots: false,
    //    // prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button"><i class="fal fa-arrow-left"></i></button>',
    //    // nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"><i class="fal fa-arrow-right"></i></button>',
    //     responsive: [{
    //         breakpoint: 1024,
    //         settings: {
    //         slidesToScroll: 1,
    //         slidesPerRow: 1,
    //         rows: 1,
    //             // centerMode: true,
    //         }

    //     }, {
    //         breakpoint: 800,
    //         settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 1, 
    //         infinite: false,
    //         }

    //     }, {
    //         breakpoint: 600,
    //         settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         dots: false,
    //         infinite: true,
    //         arrows: false,
    //         }
    //     }, 
    //     {
    //         breakpoint: 480,
    //         settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         dots: false,
    //         arrows: false,
    //         infinite: true,
    //         autoplay: true,
    //         autoplaySpeed: 2000,
    //         }
    //     }]
    // });
    

    $('.book1').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button">Prev</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        responsive: [{
            breakpoint: 1170,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                // centerMode: true,

            }

        }, {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1, 
                infinite: false,

            }


        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                infinite: true,
                arrows: true,
            }
        }]
    });
    
    // PAgination

  /*var totalRows = $('.shop .row').find('.col-md-4').length; 
  var recordPerPage = 9;
  var totalPages = Math.ceil(totalRows / recordPerPage); 
  var $pages = $('<div id="pages" class="col-md-12"></div>');
  for (i =0; i < totalPages; i++) {
    $('<span class="pageNumber">&nbsp;' + (i + 1) + '</span>').appendTo($pages);
  }
  $pages.appendTo('.shop .row');

   $('.pageNumber').hover(
    function() {
      $(this).addClass('focus');
    },
    function() {
      $(this).removeClass('focus');
    }
  );*/

   /* $('.pageNumber').removeClass('active');
   $('.pageNumber').click(function(){ 
        
        $('this').addClass('active');
   });

  $('.shop').find('.col-md-4').hide();
  var tr = $('.col-md-4');
  for (var i = 0; i <= recordPerPage - 1; i++) {
    $(tr[i]).show();
  }
  $('span').click(function(event) {
    $('.shop').find('.col-md-4').hide();
    var nBegin = ($(this).text() - 1) * recordPerPage;
    var nEnd = $(this).text() * recordPerPage - 1;
    for (var i = nBegin; i <= nEnd; i++) {
      $(tr[i]).show();
    }
  });
    
 
 
 $('.thumbnail-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: '.slider-nav-thumbnails',
});

$('.slider-nav-thumbnails').slick({
    slidesToShow: 3,
    slidesToScroll: 1, 
    asNavFor: '.thumbnail-slider',
    dots: false,
    arrows: true,
    focusOnSelect: true
});
 
$('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');
$('.slider-nav-thumbnails .slick-slide').eq(0).addClass('slick-active');
$('.slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    var mySlideNumber = nextSlide;
    $('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');
    $('.slider-nav-thumbnails .slick-slide').eq(mySlideNumber).addClass('slick-active');
}); */




})(jQuery);


// Rinkesh 29-04-2019

$(document).ready(function(){
    $('.add_to_cart').on('click',function(){
        //Scroll to top if cart icon is hidden on top
        $('html, body').animate({
        'scrollTop' : $(".cart_anchor").position().top
        });
        //Select item image and pass to the function
        var itemImg = $(this).parent().find('img').eq(0);
        flyToElement($(itemImg), $('.cart_anchor'));
    });
});
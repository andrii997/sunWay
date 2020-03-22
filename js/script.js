$(document).ready(function() {
    
    setTimeout(function(){
        $("#banner .cart").css("right","0");
    },2000);

	/*Header menu*/

	$(".header__menu img").click(function(e){
		e.preventDefault();
		$("#menu").toggleClass("show");
	});

	$("#menu a").click(function(){

		setTimeout(function() {
			$(".header__menu img").click();
		}, 200);
		
	});

	$(document).on('click','.milk-shadow',function(){
		$(".header__menu img").click();
	});

	
	$('.slider-for').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  fade: true,
	  draggable: false,
	  asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
	  slidesToShow: 4,
	  slidesToScroll: 1,
	  asNavFor: '.slider-for',
	  dots: true,
	  centerMode: true,
	  focusOnSelect: true
	});  

	$('.cart').magnificPopup({
		type: 'inline',
		preloader: false
	});
	$('.buy').magnificPopup({
		type: 'inline',
		preloader: false
	});
});

$(function(){

var today = new Date();
var my_year = today.getFullYear();
var my_month = today.getMonth();
var my_date = today.getDate()+1;
var dec = new Date(2020, 02, 01, 0, 0, 0, 0); 

	var note = $('#note'),
		//ts = new Date(2012, 0, 1),
		ts = new Date(my_year, my_month, my_date),
		newYear = true;
	
	if((new Date()) > ts){
		// The new year is here! Count towards something else.
		// Notice the *1000 at the end - time must be in milliseconds
		ts = (new Date()).getTime() + 10*24*60*60*1000;
		newYear = false;

	}
		
	$('#countdown').countdown({
		timestamp	: dec,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " Дней" + ( days==1 ? '':'' ) + ", ";
			message += hours + " Часов" + ( hours==1 ? '':'' ) + ", ";
			message += minutes + " Минут" + ( minutes==1 ? '':'' ) + " and ";
			message += seconds + " Секунд" + ( seconds==1 ? '':'' ) + " <br />";
			
			if(newYear){
				message += ""; // до конца акции осталось
			}
			else {
				message += ""; // осталось 10 дней до конца
			}
			
			//note.html(message);
		}
	});
	
});
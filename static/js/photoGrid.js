$(document).ready(function() {

	console.log('Made by @khansubhan95 https://github.com/khansubhan95');

	var $grid = $('.grid').imagesLoaded( function() {
	  $grid.masonry({
	    itemSelector: '.grid-item',
	    percentPosition: true,
	    columnWidth: '.grid-sizer'
	  }); 
	});
})

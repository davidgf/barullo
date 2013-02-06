$(document).ready(function() {
	jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
	}
	if($('#notice').html()) {
		$('#notice').center().fadeIn('2').delay(3000).fadeOut('2');
	}
});
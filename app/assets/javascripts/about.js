function updateCountdown() {
	var remaining = 140 - $('#comment_message').val().length;
	if(remaining<0){
		$('#countdown').html('We\'ll only keep 140 characters!');
	}else{
		$('#countdown').html(remaining);
	}
}

$(document).ready(function() {
	updateCountdown();
	$('#comment_message').change(updateCountdown);
	$('#comment_message').keyup(updateCountdown);
});
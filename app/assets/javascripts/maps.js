// GMAPS

var lat;
var lng;

function createMap(z,name){
	lat || (lat = 54.188155);
	lng || (lng = -3.55957);
	name || (name = "map");
	var latlng = new google.maps.LatLng(lat, lng);
  map = new google.maps.Map(document.getElementById(name), {zoom: z, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});
}

// INDEX MAP

var concerts;
var not_localized;
var marker = new Object();
var infowindow = new google.maps.InfoWindow({maxWidth: 350});

function indexMap(){
	createMap(6);
	lat = 0;
	lng = 0;
	infowindow = new google.maps.InfoWindow();
}

//TODO display all artist in concert
//TODO paginate results in infowindow
function refreshConcertsMap(concerts_hash){
	if(size(concerts_hash)<1) { return false; }
	$.each(concerts_hash, function(index, concerts_venue){
		marker[index] = new google.maps.Marker({position: new google.maps.LatLng(concerts_venue[0].venue.location.point.lat, concerts_venue[0].venue.location.point.long), map: map });
		var content='<div class="infowindow"><h1><span>...where? </span>'+index+'</h1>';
		$.each(concerts_venue, function(ind,gig){
			link='<div class="fmlink"><a href='+gig.url+' target="_blank" >More info...</a></div>'
			content = content+'<div class="gig"><h2>'+gig.title+'</h2><span>...who? </span>'+
			gig.artists.artists+'</br><span>...when? </span>'+gig.date_js+'</br>'+link+'</div>';
		});
		content=content+'</div>'
		google.maps.event.addListener(marker[index], 'click', function() {
			infowindow.setContent(content);
			infowindow.setOptions({maxWidth: 350})
			infowindow.open(map,marker[index]);
		});
	});
	var bounds = boundForConcerts(concerts_hash);
	map.fitBounds(bounds);
}

function size(object) {
	if (object == null){ return 0; }
  var i = 0;
  $.each(object,function(){
  	i++;
  });
  return i;
}

function notLocatedConcerts(not_located){
	//$('aside.widget.left').hide();
	$('aside.widget.left').css('visibility','hidden');
	if(size(not_located)<1) { return false; }
	var content_missing='<header></header><div id="another_concerts"><p>sorry, we can\'t geolocate...</p>';
	$.each(not_located, function(index, concerts_venue){
		/*content_missing=content_missing+'<h1>'+index+'</h1>';*/
		$.each(concerts_venue, function(ind,gig){
			link='<div class="fmlink"><a href='+gig.url+' target="_blank" >More info...</a></div>'
			content_missing = content_missing+'<div class="gig"><h2>'+gig.title+'</h2><span>...who? </span>'+
				gig.artists.artists+'</br><span>...where? </span>'+gig.venue.name+', '+gig.venue.location.city+
				'</br><span>...when? </span>'+gig.date_js+'</br>'+link+'</div>';
		});
	});
	content_missing=content_missing+'</div>';
	$('aside.widget.left').html(content_missing);
	//$('aside.widget.left').fadeIn('slow');
	$('aside.widget.left').css('visibility','visible').hide().fadeIn('slow');
}

function boundForConcerts(collection){
	var result = new google.maps.LatLngBounds();
	var aux;
	var i = 0;
	$.each(collection, function(index, conc){
		$.each(conc, function(ind,gig){
			aux = new google.maps.LatLng(gig.venue.location.point.lat,gig.venue.location.point.long);
			if(!isNaN(aux.lat()) && !isNaN(aux.lng())){
				result.extend(aux);
			}
		});
	});
	return result;
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (marker) {
    $.each(marker, function(index,c) { 
    	c.setMap(null);
    })
    marker = new Object();
  }
}


$(document).ready(function() {
	indexMap();
	$('#spinner').css('visibility','hidden');
	$('#search_form').bind('ajax:beforeSend', function(event, xhr, settings) {
		$('#spinner').css('visibility','visible');
  });
  $('#search_form').bind('ajax:complete', function(event, xhr, settings) {
		$('#spinner').css('visibility','hidden');
	});
	$('#radius_fields').css('display','none')
	$('#search_by').change(function(){
		if($('#search_by').val() == 'geo') { 
			$('#radius_fields').show('1');
		} else {
			$('#radius_fields').hide('1');
		}
	})
	jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
	}
});

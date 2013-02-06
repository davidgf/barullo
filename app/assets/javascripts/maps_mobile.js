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
var marker = new Object();
var infowindow = new google.maps.InfoWindow();

function indexMap(){
	createMap(6);
	lat = 0;
	lng = 0;
	infowindow = new google.maps.InfoWindow();
}

//TODO display all artist in concert
//TODO paginate results in infowindow
function refreshConcertsMap(concerts_hash){
	$.each(concerts_hash, function(index, concerts_venue){
		marker[index] = new google.maps.Marker({position: new google.maps.LatLng(concerts_venue[0].venue.location.point.lat, concerts_venue[0].venue.location.point.long), map: map });
		var content='<div class="infowindow"><h1>'+index+'</h1>';
		$.each(concerts_venue, function(ind,gig){
			link='<div class="fmlink"><a href='+gig.url+' target="_blank" >More info...</a></div>'
			content = content+'<div class="gig"><h2>'+gig.title+'</h2><div class="artists">Artists: '+gig.artists.artists+
				'</div><div id="date">Date: '+gig.date+'</div>'+link+'</div>';
		});
		content=content+'</div>'
		google.maps.event.addListener(marker[index], 'click', function() {
			infowindow.setContent(content);
			infowindow.open(map,marker[index]);
		});
	});
	var bounds = boundForConcerts(concerts_hash);
	map.fitBounds(bounds);
}

function boundForConcerts(collection){
	var result = new google.maps.LatLngBounds();
	var aux;
	var i = 0;
	$.each(collection, function(index, conc){
		$.each(conc, function(ind,gig){
			aux = new google.maps.LatLng(gig.venue.location.point.lat,gig.venue.location.point.long);
			if(!isNaN(aux.Pa) && !isNaN(aux.Qa)){
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
	/*$('#search_form').submit(function(){
		$.get('/search',function(data){
			alert(data);
		})
	});*/
	$('#search_btn').click(function(){
		var values = {};
		$.each($('#search_form').serializeArray(), function(i, field) {
    	values[field.name] = field.value;
		});
		$.get('/search',values,function(data){
			$.mobile.changePage($('#main'))
		},'script');
	});
});

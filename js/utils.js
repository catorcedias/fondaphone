// JavaScript Document

function calculateDistance(coordsA, coordsB){
	var lat1 = coordsA.lat;
	var lat2 = coordsB.lat;
	var lon1 = coordsA.lon;
	var lon2 = coordsB.lon;
	
	var R = 6371; // km
	var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
	var y = (lat2-lat1);
	var d = Math.sqrt(x*x + y*y) *R*20;
	
	return d;
}

function toRadian(deg) {
	return deg * Math.PI / 180;
};

function setMapMarker( mapContainerId, title,lat, long) {
	alert("hi");
	var myLatlng = new google.maps.LatLng(lat,long);
	var mapOptions = {
	zoom: 4,
	center: myLatlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map($(mapContainerId), mapOptions);
	
	var marker = new google.maps.Marker({
	  position: myLatlng,
	  map: map,
	  title: 'Hello World!'
	});
}

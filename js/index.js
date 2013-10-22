function onDeviceReady() {
	$('.listening').hide();
	$('.received').show();
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//var idNav= navigator.geolocation.watchPosition(onSuccess, onError,{"timeout": 1000});
}


	function onSuccess(position) {
		var result = '<p>Latitude: '          + position.coords.latitude       + '</p>' +
					  '<p>Longitude: '         + position.coords.longitude         + '</p>' +
					  '<p>Altitude: '          + position.coords.altitude          + '</p>' +
					  '<p>Accuracy: '          + position.coords.accuracy          + '</p>' +
					  '<p>Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '</p>' +
					  '<p>Heading: '           + position.coords.heading           + '</p>' +
					  '<p>Speed: '             + position.coords.speed             + '</p>' +
					  '<p>Timestamp: '         + position.timestamp                + '</p>';
		
		result += "<p>distance: "+distance( {"lat":19.41, "lon":-99.17}, {"lat":position.coords.latitude, "lon":position.coords.longitude }  ) + '</p>';
		
	
		$("#stage1").hide();
		$("#stage2").html( result );
	};
	

	function onError(error) {
		$("#stage2").html('<p>code: '+ error.code + '</p><p>message: ' + error.message + '</p>');
	}
	
	
	
	function toRadian(deg) {
		return deg * Math.PI / 180;
	};

	function distance(coordsA, coordsB){
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


	var currentLat=0;
	var currentLong=0;
	
	function onDeviceReady() {
		$('.listening').hide();
		$('.received').show();
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		//var idNav= navigator.geolocation.watchPosition(onSuccess, onError,{"timeout": 1000});
	}

	function onSuccess(position) {
		currentLat= position.coords.latitude;
		currentLon= position.coords.longitude;
	
		var result = '<p>Latitude: '          + position.coords.latitude       + '</p>' +
					  '<p>Longitude: '         + position.coords.longitude         + '</p>' +
					  '<p>Altitude: '          + position.coords.altitude          + '</p>' +
					  '<p>Accuracy: '          + position.coords.accuracy          + '</p>' +
					  '<p>Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '</p>' +
					  '<p>Heading: '           + position.coords.heading           + '</p>' +
					  '<p>Speed: '             + position.coords.speed             + '</p>' +
					  '<p>Timestamp: '         + position.timestamp                + '</p>';
		
		result += "<p>distance: "+calculateDistance( {"lat":19.41, "lon":-99.17}, {"lat":position.coords.latitude, "lon":position.coords.longitude }  ) + '</p>';
	
		$("#stage1").hide();
		$("#stage2").html( result );
		
		getSucursales( loadData );
	};
	
	function onError(error) {
		$("#stage2").html('<p>code: '+ error.code + '</p><p>message: ' + error.message + '</p>');
	}
	
	function toRadian(deg) {
		return deg * Math.PI / 180;
	};

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
	
	function Sucursal(id, name, direction, lat, long){
		this.id= id;
		this.name= name;
		this.direction = direction;
		this.latitud= lat;
		this.longitud = long;
	}
	
	function getSucursales( onComplete ){
		var sucursales =new Array();
		var sucursalAux;
		$.ajax({
		  url: "xml/sucursales.xml",
		  dataType: 'xml',
		  success: function( xml ) {
			$(xml).find('sucursal').each(function(){
				sucursalAux = new Sucursal( $(this).find('id').text(), $(this).find('nombre').text(), $(this).find('direccion').text(),Number($(this).find('latitud').text()),Number($(this).find('longitud').text()));
				sucursales[sucursales.length]= sucursalAux;
			});
			onComplete( sucursales );
		  },
		  error: function( a,b,c ) {
			  alert("Error intentando obtener la información");
		  }
		});
	}
	
	function loadData( sucursales ){
		var sucursal = getClosest( sucursales, currentLat, currentLon);
		var distance = calculateDistance({"lat": sucursal.latitud, "lon": sucursal.longitud}, {"lat": currentLat, "lon": currentLon});
		$("#stage2").html( "La sucursal mas cercana es la de: "+ sucursal.name + " a una distancia de "+ distance  );
	}
	
	//Search the closest store to the lat and long coordinates
	function getClosest( sucursales , lat, long){
		var minDistance=100000000;
		var distanceAux;
		var sucursalAux;
		for (var i=0; i<sucursales.length; i++){
			distanceAux = calculateDistance({"lat": sucursales[i].latitud, "lon": sucursales[i].longitud}, {"lat": lat, "lon": long});
			alert( distanceAux);
			if ( distanceAux < minDistance){
				sucursalAux = sucursales[i];
				minDistance= distanceAux;
			}
		}
		return sucursalAux;	
	}
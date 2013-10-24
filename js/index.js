	var currentLat=0;
	var currentLong=0;
	var currentBranch;
	
	function onDeviceReady() {
		$('.listening').hide();
		$('.received').show();
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		
		//var idNav= navigator.geolocation.watchPosition(onSuccess, onError,{"timeout": 1000});
	}

	function onSuccess(position) {
		currentLat= position.coords.latitude;
		currentLon= position.coords.longitude;
		getBranches( loadData );
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
	
	function Branch(id, name, direction, lat, long){
		this.id= id;
		this.name= name;
		this.direction = direction;
		this.latitud= lat;
		this.longitud = long;
		this.order=0;
	}
	
	function sortFunction( a, b){
		if( a.order< b.order) return -1;
		if( a.order < b.order ) return 0;
		if( a.order > b.order ) return 1;
	}
	
	function getBranches( onComplete ){
		var branches =new Array();
		var branchAux;
		$.ajax({
		  url: "xml/sucursales.xml",
		  dataType: 'xml',
		  success: function( xml ) {
			$(xml).find('sucursal').each(function(){
				branchAux = new Branch( $(this).find('id').text(), $(this).find('nombre').text(), $(this).find('direccion').text(),Number($(this).find('latitud').text()),Number($(this).find('longitud').text()));
				branchAux.order= calculateDistance({"lat": branchAux.latitud, "lon": branchAux.longitud}, {"lat": currentLat, "lon": currentLon});
				branches[branches.length]= branchAux;
			});
			//Sorting the array
			branches.sort( sortFunction );
			onComplete( branches );
		  },
		  error: function( a,b,c ) {
			  alert("Error intentando obtener la información");
		  }
		});
	}
	
	function loadData( branches ){
		document.location="#page1";
		
		//Showing branches
		var htmlAux ='<li data-role="list-divider" role="heading">Sucursales</li>';
		for( var i=0; i< branches.length; i++) {
			 htmlAux +='<li data-theme="c"><a class="view" href="#" data-id="'+ i+'">'+ branches[i].name +' - '+ Math.ceil(branches[i].order)+'Mts</a><a class="select" data-id="'+ i+'">Select</a></li>';
		}
		$("#page1 .branches").html( htmlAux );
		$("#page1 .branches li a.view").click( function(){
			viewData( branches[ $(this).attr("data-id")]);
		});
		$("#page1 .branches li a.select").click( function(){
			currentBranch = branches[ $(this).attr("data-id")];
			document.location="#page2";
			$("#page2 .currentbranch").html( currentBranch.name );
			
		});
		viewData(branches[0]);
	}
	
	function viewData( branch ){
		$(".name").html( branch.name );
		$(".direction").html( branch.direction );
		$(".map").html('<iframe width="250" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.es/?ie=UTF8&amp;ll='+ branch.latitud+','+ branch.longitud+'&amp;spn=0.01722,0.033023&amp;t=m&amp;z=16&amp;output=embed"></iframe>');
	}
	
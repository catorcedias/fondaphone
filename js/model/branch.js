function Branch(id, name, direction, lat, long){
	this.id= id;
	this.name= name;
	this.direction = direction;
	this.latitud= lat;
	this.longitud = long;
	this.order=0;
}

function sortBranches( a, b){
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
		branches.sort( sortBranches );
		onComplete( branches );
	  },
	  error: function( a,b,c ) {
		  alert("Error intentando obtener la información");
	  }
	});
}
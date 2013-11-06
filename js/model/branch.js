var branchesCache;

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

function getBranches(){
	return branchesCache;
}

function loadBranches( onComplete ){
	branchesCache = new Array();
	var branchAux;
	$.ajax({
	  url: "data/sucursales.json",
	  dataType: 'json',
	  success: function( json ) {
	  	branchAux;
	  	for(var i=0; i < json.sucursales.length; i++){
	  		branchAux = new Branch(json.sucursales[i].id, json.sucursales[i].nombre,json.sucursales[i].direccion,Number(json.sucursales[i].latitud),Number(json.sucursales[i].longitud));
			branchAux.order= calculateDistance({"lat": branchAux.latitud, "lon": branchAux.longitud}, {"lat": currentLat, "lon": currentLon});
			branchesCache[branchesCache.length]= branchAux;
	  	}
		//Sorting the array
		branchesCache.sort(sortBranches);
		onComplete();
	  },
	  error: function( a,b,c ) {
		  alert("Error intentando obtener la información");
	  }
	});
}
var itemsCache;

function Item( id,type,name,image,description,price,currency){
	this.id=id;
	this.type = type;
	this.name= name;
	this.image= image;
	this.description = description;
	this.price= price;
	this.currency= currency;
}

function equals(a,b){
	return a.id == b.id;
}

function sortItems(a, b){
	if( a.name< b.name) return -1;
	if( a.name < b.name ) return 0;
	if( a.name > b.name ) return 1;
}

function getItem(itemId){
	for(var i=0; i< itemsCache.length; i++){
		if(itemsCache[i].id==itemId) return itemsCache[i];
	}
	return null;
}

function getItems(){
	return itemsCache;
}

function loadItems(onComplete){
	$.ajax({
	  url: "data/items.json",
	  dataType: 'json',
	  success: function( json ) {
	  	itemsCache = new Array();
	  	for(var i=0; i < json.items.length; i++){
			itemsCache[itemsCache.length] = new Item(json.items[i].id, json.items[i].tipo,json.items[i].nombre,json.items[i].descipcion,Number(json.items[i].precio),json.items[i].moneda);
	  	}
		//Sorting the array
		onComplete( );
	  },
	  error: function( a,b,c ) {
		  alert("Error intentando obtener la información");
	  }
	});
}

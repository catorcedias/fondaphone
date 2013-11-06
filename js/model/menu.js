var menuCache;

// JavaScript Document
function Menu(idBranch, categories){
	this.idBranch= idBranch;
	this.categories = categories;
	this.getItem= function(id){
		var itemAux;
		for(var i =0; i<this.categories.length;i++){
			itemAux= this.categories[i].getItem(id);
			if(itemAux != undefined){
				return itemAux;			
			}
		}
		return undefined;
	}
}

function getMenu(){
	return menuCache;
}

function loadMenu(idBranch, onComplete){
	var categories=new Array();
	var categoryAux;
	var itemAux;
	var itemsAux;
	var menu;
	$.ajax({
	  url: "data/menu_"+idBranch+".json",
	  dataType: 'json',
	  success: function( json ) {
	  	categories = new Array();
	  	for(var i=0; i < json.categorias.length; i++){
	  		itemsAux = new Array();
	  		for(var j=0; j < json.categorias[i].items.length; j++){
	  			itemsAux[itemsAux.length] = getItem(json.categorias[i].items[j]);
	  		}
	  		categories[categories.length] = new Category(json.categorias[i].nombre, itemsAux);
	  	}
	  	menuCache = new Menu(idBranch, categories);
	  	onComplete();
	  },
	  error: function( a,b,c ) {
		  alert("Error in loadMenu.");
	  }
	});
}



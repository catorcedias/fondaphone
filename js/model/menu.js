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

function getMenu(idBranch, onComplete){
	var categories =new Array();
	var categoryAux;
	var itemAux;
	var itemsAux;
	var menu;
	$.ajax({
	  url: "xml/menu_"+idBranch+".xml",
	  dataType: 'xml',
	  success: function( xml ) {
		$(xml).find('categoria').each(function(){
			itemsAux = new Array();
			$(this).find('item').each(function(){
				itemsAux[itemsAux.length] = new Item( $(this).find("id").text(),$(this).find("tipo").text(), $(this).find("nombre").text(), $(this).find("imagen").text(),$(this).find("descripcion").text(),$(this).find("precio").text(),$(this).find("moneda").text());
			});
			categories[categories.length] = new Category( $(this).children("nombre").text(), itemsAux );
		});
		onComplete(new Menu(idBranch, categories));
	  },
	  error: function( a,b,c ) {
		  alert("Error");
	  }
	});
}


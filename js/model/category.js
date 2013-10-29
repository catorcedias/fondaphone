// JavaScript Document
function Category( name, items){
	this.name= name;
	this.items= items;
	
	this.getItem= function(id){
		var itemAux;
		for(var i=0; i<this.items.length;i++){
			itemAux= this.items[i];
			if(itemAux.id == id){
				return itemAux;			
			}
		}
		return undefined;
	}
}

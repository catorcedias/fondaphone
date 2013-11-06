function OrderItem(item,quantity,owner){
	this.item=item;
	this.subtotal= item.price * quantity;
	this.quantity=quantity;	
	this.owner=owner;
	
	this.setQuantity = function(quantity){
		this.quantity= quantity;
		this.subtotal= item.price * quantity;
	}
}

function Order( ){
	
	this.orderItems = new Array();
	
	this.addItem = function( item, owner ){
		if (item instanceof Item){
			for (var i=0; i < this.orderItems.length; i++){
				if( item.id == this.orderItems[i].item.id ) {
					this.orderItems[i].setQuantity(this.orderItems[i].quantity+1);
					this.orderItems[i].owner = owner;
					break;
				}
			}
			if (i == this.orderItems.length){
				this.orderItems[this.orderItems.length]= new OrderItem( item , 1, owner);
			}
		}
	}
	
	this.removeItem = function( itemId ){
		var newItems = new Array();
		for (var i=0; i < this.orderItems.length; i++){
			if( itemId != this.orderItems[i].item.id ) this.newItems[this.newItems.length] = this.orderItems[i];
		}
		this.orderItems = newItems;
	}
	
	this.updateQuantityItem = function( itemId, quantity ){
		this.getItem(itemId).setQuantity(quantity);
	}	
	
	this.getItem = function( itemId ){
		for (var i=0; i < this.orderItems.length; i++){
			if( itemId == this.orderItems[i].item.id ) return this.orderItems[i];
		}
		return null;
	}	
	
	this.total = function( ){
		var total=0;
		for (var i=0; i < this.orderItems.length; i++){
			total += Number(this.orderItems[i].subtotal);
		}
		return total;
	}	
}

	var currentLat=0;
	var currentLong=0;
	var currentBranch;
	var currentMenu;
	var currentOrder;

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
		
		//showAlert();
	};
	
 	// alerta cerrada
    function alertDismissed() {
        // hacer algo aquí
    }

    // Muestra un cuadro de dialogo personalizado
    //
    function showAlert( message ) {
	    navigator.notification.alert(
	    message,     // mensaje (message)
	    alertDismissed,         // función 'callback' (alertCallback)
	    'Prueba de mensaje',            // titulo (title)
	    'Cerrar'                // nombre del botón (buttonName)
	    );
    }
	
	function onError(error) {
		$("#stage2").html('<p>code: '+ error.code + '</p><p>message: ' + error.message + '</p>');
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
		setMapMarker(".map",brand.name, branch.latitud, branch.longitud);
	}
	
	function click_CartaBtn(){
		getMenu(currentBranch.id, function( menu){
			currentMenu=menu;
			//Show menu
			var htmlAux ='';
			for( var i=0; i< menu.categories.length; i++) {
				htmlAux+= '<div data-role="collapsible"><h4>'+ menu.categories[i].name +'</h4><ul data-role="listview" data-inset="true" data-split-theme="a">';
				for( var j=0; j< menu.categories[i].items.length; j++) {
					htmlAux+= '<li data-theme="c"><img src="img/logo.png" />';
					htmlAux+= '<h4><a>'+menu.categories[i].items[j].name+' $'+  menu.categories[i].items[j].price+'.-</a></h4>';
					htmlAux+= '<p>'+ menu.categories[i].items[j].description+'</p>';
					htmlAux+= '<p><input type="text" value="-Defecto-" data-mini="true" width="100px"  data-inline="true" size="15" id="oadd_'+ menu.categories[i].items[j].id+'"/><input type="number" value="0" data-mini="true" width="50px" min="1" max="5" data-inline="true" size="2" id="qadd_'+ menu.categories[i].items[j].id+'"/><a href="#" onclick="addToOrder('+ menu.categories[i].items[j].id+')">Add to order</a></p>';
					htmlAux+= '<p><a href="#"  onclick="removeFromOrder('+ menu.categories[i].items[j].id+')">Remove from order</a></p>';
					htmlAux+= '</li>';
				}
				
				htmlAux+= '</ul></div>';
			}
			$("#menulist").html(htmlAux);
		});
		
	}
	
	function click_OrderBtn(){
		var orderItemAux;
		var htmlAux='<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke"><thead><tr><th>Dueño</th><th>Item</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th></tr></thead><tbody>';
		for( var i=0; i < currentOrder.orderItems.length; i++){
			orderItemAux = currentOrder.orderItems[i];
			htmlAux += '<tr><td>'+orderItemAux.owner+'</td><td>'+orderItemAux.item.name+'</td><td><input type="number" value="'+orderItemAux.quantity+'" data-mini="true" width="50px" min="1" max="50"/></td><td>'+orderItemAux.item.price+'</td><td>'+orderItemAux.subtotal+'</td></tr>';
		}
		htmlAux +="<tr><td colspan='3'>Total</td><td>"+ currentOrder.total() +"</td></tr>";
		htmlAux+="</tbody></table>";
		$("#order").html(htmlAux);
	}
	
	
	
	function newOrder( ){
		currentOrder = new Order();	
	}
	
	function addToOrder( itemId ){
			if( currentOrder == undefined){
				currentOrder = new Order();	
			}
			for( var i=0; i<$("#qadd_"+itemId).val();i++){
				currentOrder.addItem(currentMenu.getItem(itemId), $("#oadd_"+itemId).val());
			}
	}
	
	function removeFromOrder( itemId ){
		
	}
	
	
	var currentLat=0;
	var currentLong=0;
	var currentBranch;
	var currentOrder;
	var items;

	function onDeviceReady(){
		$('.listening').hide();
		$('.received').show();
		navigator.geolocation.getCurrentPosition(
			function(position){
				currentLat= position.coords.latitude;
				currentLon= position.coords.longitude;
				loadItems(function(){
					loadBranches(function(){
						loadFavs(function(){
							initBranches();
						});
					});
				});
			}
		, function(error){
			$("#stage2").html('<p>code: '+ error.code + '</p><p>message: ' + error.message + '</p>');
		});
	}

	function initBranches(){
		//loading branches
		var branches = getBranches();
		var htmlAux ='<li data-role="list-divider" role="heading">Sucursales</li>';
		for( var i=0; i< branches.length; i++) {
			 htmlAux +='<li data-theme="c"><a class="view" href="#" data-id="'+ i+'">'+ branches[i].name +' - '+ Math.ceil(branches[i].order)+'Mts</a><a class="select" href="#page2" data-id="'+ i+'">Select</a></li>';
		}
		$("#page1 .branches").html( htmlAux );
		$("#page1 .branches li a.view").click( function(){
			initBranch(branches[ $(this).attr("data-id")]);
		});
		$("#page1 .branches li a.select").click( function(){
			currentBranch = branches[ $(this).attr("data-id")];
			$("#page2 .currentbranch").html( currentBranch.name );
			loadMenu(currentBranch.id, initMenu );			
		});
		initBranch(branches[0]);
		window.location="#page1";
	}
	
	function initMenu(){
		var menu = getMenu();
		//Show menu
		var htmlAux ='';
		var active='';
		for( var i=0; i< menu.categories.length; i++) {
			htmlAux+= '<div data-role="collapsible"><h4>'+ menu.categories[i].name +'</h4><ul data-role="listview" data-inset="true" data-split-theme="a">';
			for( var j=0; j< menu.categories[i].items.length; j++) {
				htmlAux+= '<li data-theme="c"><img src="img/logo.png" width="100px height="100px""/>';
				htmlAux+= '<h4><a>'+menu.categories[i].items[j].name+' $'+  menu.categories[i].items[j].price+'.-</a></h4>';
				htmlAux+= '<p>'+ menu.categories[i].items[j].description+'</p>';
				htmlAux+= '<p><input type="text" value="-Defecto-" data-mini="true" width="100px"  data-inline="true" size="15" id="oadd_'+ menu.categories[i].items[j].id+'"/><input type="number" value="1" data-mini="true" min="1" data-inline="true" size="2" id="qadd_'+ menu.categories[i].items[j].id+'"/><a href="#" class="addtoorder" onclick="addToOrder('+ menu.categories[i].items[j].id+')"></a>';
				active =  ( existInFavs(menu.categories[i].items[j].id))? 'active':'';
				htmlAux+= '<a href="#" data-id="'+ menu.categories[i].items[j].id+'" class="addtofavs '+ active +'"></a></p>';
				htmlAux+= '</li>';
			}
			htmlAux+= '</ul></div>';
		}
		$("#menulist").html(htmlAux);
		
		$("a.addtofavs").click( function(){
			if( $(this).hasClass('active')){
				click_removeFromFavs($(this).attr("data-id"));
				$(this).removeClass("active");
			}else{
				click_addToFavs( $(this).attr("data-id"));
				$(this).addClass("active");
			}
		});
		
		$("#menulist").trigger("create");
	}
	
	function initBranch( branch ){
		$(".name").html( branch.name );
		$(".direction").html( branch.direction );
		$(".map").html();//'<iframe width="250" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.es/?ie=UTF8&amp;ll='+ branch.latitud+','+ branch.longitud+'&amp;spn=0.01722,0.033023&amp;t=m&amp;z=16&amp;output=embed"></iframe>');
		setMapMarker(".map",branch.name, branch.latitud, branch.longitud);
	}
	
	
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
	
	function newOrder( ){
		currentOrder = new Order();	
	}
	
	function addToOrder( itemId ){
		if( currentOrder == undefined) currentOrder = new Order();	
		for( var i=0; i<$("#qadd_"+itemId).val();i++){
			currentOrder.addItem( getItem(itemId), $("#oadd_"+itemId).val());
		}
		initOrder();
	}
	
	function removeFromOrder( itemId ){
		currentOrder.removeItem(itemId);
		initOrder();
	}
	
	function changeQuantiyFromOrder( itemId ){
		$("#q_"+ itemId).prop('disabled', true);
		currentOrder.updateQuantityItem(itemId, $("#q_"+ itemId).val());
		initOrder();
	}
	
	function initOrder(){
		var orderItemAux;
		var htmlAux='<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke"><thead><tr><th>Dueño</th><th>Item</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th><th></th></tr></thead><tbody>';
		for( var i=0; i < currentOrder.orderItems.length; i++){
			orderItemAux = currentOrder.orderItems[i];
			htmlAux+='<tr><td>'+orderItemAux.owner+'</td><td>'+orderItemAux.item.name+'</td><td><input id="q_'+orderItemAux.item.id+'" type="number" value="'+orderItemAux.quantity+'" data-mini="true" width="50px" min="1" max="50" onchange="changeQuantiyFromOrder('+orderItemAux.item.id+')"/></td><td>'+orderItemAux.item.price+'</td><td>'+orderItemAux.subtotal+'</td><td><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" title="Borrar" onclick="removeFromOrder('+orderItemAux.item.id+')">Borrar</a></td></tr>';
		}
		htmlAux+="<tr><td colspan='3'>Total</td><td>"+ currentOrder.total() +"</td></tr>";
		htmlAux+="</tbody></table>";
		$("#order").html(htmlAux);
		$("#order").trigger("create");
		
	}
	
	function initFavs(){
		var favs = getFavs();
		var htmlAux='<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke"><thead><tr><th>Item</th><th></th></tr></thead><tbody>';
		for(var i=0; i < favs.length; i++){
			htmlAux+='<tr><td>'+ getItem(favs[i]).name+'</td><td><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" title="Borrar" onclick="click_removeFromFavs('+favs[i]+')">Borrar</a></td></tr>';
		}
		$("#favs").html(htmlAux);
		$("#favs").trigger("create");	
	}
	
	function removeFromOrder( itemId ){
		currentOrder.removeItem(itemId);
		initOrder();
	}
	
	function click_clearFavsBtn(){
		clearFavs();
	}
	
	function click_FavsBtn(){
		initFavs();
	}
	
	function click_addToFavs(itemId){
		addToFavs(itemId,function(){});
	}
	
	function click_removeFromFavs(itemId){
		removeFromFavs(itemId,function(){
			initFavs();
		});
	}
	
	function click_BackBtn(){
	} 
		
	function click_CartaBtn(){
		
	}
	
	function click_OrderBtn(){
		
	}
	
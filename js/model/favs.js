var favsCache;

var addToFavs= function(itemId, onComplete){
	if (!existInFavs(itemId)){
		var dbConn = new DB();
		dbConn.execute("INSERT INTO favorites (id) VALUES("+itemId+")",onComplete);
		favsCache[favsCache.length]=itemId;
	}
} 

var removeFromFavs= function(itemId, onComplete){
	if (existInFavs(itemId)){
		var dbConn = new DB();
		dbConn.execute("DELETE FROM favorites WHERE id ="+itemId,onComplete);
		var favsAux= new Array();
		for(var i=0; i<favsCache.length; i++){
			if(favsCache[i] != itemId) favsAux[favsAux.length]=favsCache[i];
		}
		favsCache = favsAux;
	}
} 

var clearFavs = function(){
	tx.executeSql('DROP TABLE IF EXISTS favorites');
	window.localStorage.clear();
}

var existInFavs= function(itemId){
    for (var i=0; i<favsCache.length; i++){
    	if(favsCache[i]==itemId) return true;
    }
    return false;
} 

var getFavs= function(){
	return favsCache;
} 

function loadFavs(onComplete){
	var dbConn = new DB();
	dbConn.execute("CREATE TABLE IF NOT EXISTS favorites (id)",function(){
		dbConn.query("SELECT * FROM favorites", [], function(favs){
			favsCache= new Array();
	        for (var i=0; i< favs.length; i++){
	        	favsCache[favsCache.length]= favs.item(i).id;
	        }
			onComplete();
		});
	});
}




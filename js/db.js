function DB(){
	var db = window.openDatabase("fondaapp", "1.0", "PhoneGap Demo", 200000);
	
	this.execute = function(query, onComplete){	
		
		db.transaction(function(tx){
			tx.executeSql(query);
		},function(err){
			console.log("Error processing SQL: "+err.code);
		}, function(){
		  	onComplete();
		});	
	}
	
	this.query = function(query,params,onComplete){
		db.transaction(function(tx){
			tx.executeSql(query, params, function(tx,results){
				onComplete(results.rows);
			}, function(err){
				console.log("Error processing SQL: "+err.code);
			});
		}, function(err){
			console.log("Error processing SQL: "+err.code);
		});	
	}
}	

	
	
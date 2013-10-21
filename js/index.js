/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		$('.listening').hide();
		$('.received').show();
		
		// onSuccess Callback
		// This method accepts a Position object, which contains the
		// current GPS coordinates
		//
		function onSuccess(position) {
			var result = '<p>Latitude: '          + position.coords.latitude       + '</p>' +
						  '<p>Longitude: '         + position.coords.longitude         + '</p>' +
						  '<p>Altitude: '          + position.coords.altitude          + '</p>' +
						  '<p>Accuracy: '          + position.coords.accuracy          + '</p>' +
						  '<p>Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '</p>' +
						  '<p>Heading: '           + position.coords.heading           + '</p>' +
						  '<p>Speed: '             + position.coords.speed             + '</p>' +
						  '<p>Timestamp: '         + position.timestamp                + '</p>';
			
			result += "<p>distance: "+distance( {"lat":19.41, "lon":-99.17}, {"lat":position.coords.latitude, "lon":position.coords.longitude }  ) + '</p>';
			
		
			$("#stage1").hide();
			$("#stage2").html( result );
		};
		
		// onError Callback receives a PositionError object
		//
		function onError(error) {
			$("#stage2").html('<p>code: '+ error.code + '</p><p>message: ' + error.message + '</p>');
		}
		
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		var idNav= navigator.geolocation.watchPosition(onSuccess, onError,{"timeout": 1000});
		
		function toRadian(deg) {
			return deg * Math.PI / 180;
		};

		function distance(coordsA, coordsB){
			var lat1 = coordsA.lat;
			var lat2 = coordsB.lat;
			var lon1 = coordsA.lon;
			var lon2 = coordsB.lon;
			
			var R = 6371; // km
			var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
			var y = (lat2-lat1);
			var d = Math.sqrt(x*x + y*y) *R*20;
			
			return d;
		}
    }
};

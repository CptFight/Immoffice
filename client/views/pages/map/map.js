

Template.map.rendered = function(){
	Session.set("page_title","map");
    init_list_coord_belgium();
    $('#map .footable').footable();
    setGoogleMap(4000,5000);
};

function searchCitiesInTheRadius(lat, long, radius){
	var list = Session.get('list_coord_belgium');
	var dist = 0;
	var list_city_in_area = [];
	for(var i=0;i<list.length;i++){
		dist = getDistanceFromLatLonInMeter(lat,long,list[i].lat,list[i].lng);
		if(dist <= radius){
			list_city_in_area[list_city_in_area.length] = list[i];
		}
	}
	Session.set('list_city_in_area',list_city_in_area);
	
	setTimeout(function() {
	    $('#map .footable').trigger('footable_redraw'); 
	    $("#map #search_zipcode").button('reset');
	}, 300);
	return list_city_in_area;
}



function searchZipCode(lat, long){
	var list = Session.get('list_coord_belgium');
	var dist = 0;
	var radius = 10;
	var list_city_in_area = [];
	for(var i=0;i<list.length;i++){
		dist = getDistanceFromLatLonInMeter(lat,long,list[i].lat,list[i].lng);
		if(dist <= radius){
			list_city_in_area[list_city_in_area.length] = list[i];
		}
	}

	console.log('list_city_in_area',list_city_in_area);
	
	if(typeof list_city_in_area[list_city_in_area.length -1] != 'undefined'){
		return list_city_in_area[list_city_in_area.length -1].zip;
	}else{
		return false;
	}
	
}

function init_list_coord_belgium(){
	Meteor.call('get_list_coord_belgium', function(err, list) {
    	if (!err){
    		Session.set('list_coord_belgium',list);
    	}
    });
}

function getDistanceFromLatLonInMeter(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000 - 2000;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function setGoogleMap(zipCode,radius){
	Meteor.call('get_pos_from_zipcode', zipCode, function(err, result) {
    	if (!err && typeof result.lat != 'undefined' && typeof result.lng != 'undefined'){
        	var location = {
        		latitude : result.lat,
        		longitude : result.lng
        	}
        	$('#google-map').locationpicker({
			    location: location,
			    locationName: "",
			    radius: radius,
			    zoom: 10,
			    scrollwheel: true,
			    inputBinding: {
			        latitudeInput: null,
			        longitudeInput: null,
			        radiusInput: null,
			        locationNameInput: null
			    },
			    enableAutocomplete: false,
			    enableReverseGeocode: true,
			    onchanged: function(currentLocation, radius, isMarkerDropped) {
			    	var zipcode = searchZipCode(currentLocation.latitude,currentLocation.longitude);
			    	$('#zip_code').val(zipcode);
					searchCitiesInTheRadius(currentLocation.latitude,currentLocation.longitude,radius);
				}
			});
        }
      
    });
}


Template.map.helpers({
    list_cities_in_area : function(){
    	return Session.get('list_city_in_area');
    }
});


Template.map.events({
	'click #search_zipcode' : function(e, t){
  		e.preventDefault();
  		$("#map #search_zipcode").button('loading');

  		var zipcode = $('#zip_code').val();
  		var radius = $('#radius').val();
      	setGoogleMap(zipcode,radius);
      	Meteor.call('get_pos_from_zipcode', zipcode, function(err, result) {
      		searchCitiesInTheRadius(result.lat,result.lng,radius);
      	}); 	
 	},
 	'click .delete-city' : function(e,t){
 		e.preventDefault();
 		var target = $(e.target);
	    var zipcode = $(e.target).data('zip');

	    if(typeof zip == 'undefined' || zip == 0 ){
	        zipcode = $(e.target).closest('a').data('zip');
	    }

 		var new_list = Session.get('list_city_in_area');
 		for(var i=0;i<new_list.length;i++){
 			if(new_list[i].zip == zipcode){
 				new_list.splice(i,1);
 			}
 		}
 		Session.set('list_city_in_area',new_list);
 	},
 	'click #zoomIn' : function(e,t){
 		e.preventDefault();
 		var radius = $('#radius').val();
 		$('#radius').val(parseFloat(radius) - 1000);
 		$('#search_zipcode').trigger('click');
 	},
 	'click #zoomOut' : function(e,t){
 		e.preventDefault();
 		var radius = $('#radius').val();
 		$('#radius').val(parseFloat(radius) + 1000);
 		$('#search_zipcode').trigger('click');
 	},
 	'click #load_zipcodes': function(e,t){
 		e.preventDefault();

 		var zicodes = '';
 		var list_zipcodes = [];
 		for(var i=0;i<Session.get('list_city_in_area').length;i++){
 			var zipcode = Session.get('list_city_in_area')[i].zip;
 			if(typeof list_zipcodes[zipcode] == 'undefined' || !list_zipcodes[zipcode]){
 				zicodes += zipcode+" ";
 				list_zipcodes[zipcode] = true;
 			}
 			
 		}

 		if(Meteor.user() && Meteor.user() != null && typeof Meteor.user() != 'undefined'){

 			switch(Session.get('map_target')){
 				case 'annonces':
 					Meteor.call('set_zipcodes_for_this_user', Meteor.user()._id, zicodes,   function(err, respJson) {
				        Router.go('/annonces'); 
				    });
 					break;
 				case 'myfilters':
 					Meteor.call('set_zipcodes_for_this_filters_user', Meteor.user()._id,Session.get('map_target_id'),  zicodes,   function(err, respJson) {
				        Router.go('/myfilters'); 
				    });
 					break;
 				default:
 					break;
 			}

		  
	    }
 	}
});


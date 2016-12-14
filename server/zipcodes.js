


/***************************
*       METHODS
***************************/
Meteor.methods({
    get_pos_from_zipcode : function(zipcode){
        var result = HTTP.call("GET", "http://maps.googleapis.com/maps/api/geocode/json?address="+zipcode+",belgium&sensor=false");
        var obj = JSON.parse(result.content);
        if(typeof obj.results[0].geometry != 'undefined'){
        	return obj.results[0].geometry.location;
        }else{
        	return false;
        }  
    },
    get_list_coord_belgium : function(){
    	return JSON.parse(Assets.getText("geolocalisations/belgium/zipcode-belgium.json"));
    }

});
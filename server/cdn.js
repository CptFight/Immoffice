
//meteor add cfs:http-methods



/***************************
*       METHODS
***************************/
//NOTE USED ANYMORE
HTTP.methods({
    "/upload": function(picture) {

       // return picture;
       
        var url = Meteor.settings.public.cdn.save_path;
		
    	
    	var result = Meteor.http.call("POST", url ,{
			params:{
				"picture" : picture,
                "base64_decode" : false
			}
		}/*,function (error,result) {
			var id = result.content;
			return id;
		}*/);
        //switch to synchro return;

        return result.content;
    }

    	
});



function bufferToBase64(arrayBuffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
;
}


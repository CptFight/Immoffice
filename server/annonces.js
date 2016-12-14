


/***************************
*       INITIATE VARS 
***************************/
Annonces = new Mongo.Collection('annonces');


Meteor.publish("annonces", function () {
    //console.log('this',this);
    var user = Meteor.users.findOne(this.userId);
    if(user && typeof user.profile != 'undefined' && typeof user.profile.last_filter != 'undefined'){
        return filter(user.profile.last_filter);
    }else{
        return Annonces.find();
    }
    //return Annonces.find();
});


var cron_annonces = new Cron(60000); //1 minute

/***************************
*       CRONS
***************************/
// 120 is the number of intervals between invoking the job
// so this job will happen once every 30 minutes
cron_annonces.addJob(30, function() {
    Meteor.call('load_all_annonces_cron', function(err, respJson) {
       
    });

});


/***************************
*       CRONS
***************************/
// 120 is the number of intervals between invoking the job
// so this job will happen once every 30 minutes
/*cron_annonces.addJob(1, function() {
    console.log('test');
});*/

// 1X par jour
cron_annonces.addJob(1440, function() {
    

    var date = new Date();
    var day = ("0" + (date.getDate())).slice(-2);
    var month = ("0" + (date.getMonth())).slice(-2);
    var date_string = month+"/"+day+"/"+date.getFullYear();

    date = new Date(date_string);

    var timestamp = date.getTime() / 1000;
    Meteor.call('delete_all_old_annonces', timestamp ,function(err, respJson) {
       
    });

});



/***************************
*       METHODS
***************************/


Meteor.methods({
    load_all_annonces: function() {

     
        //var url = "http://localhost/annonces-import/get.php"; 
       var url = Meteor.settings.public.annonces.get_path;  


       // server async
        Meteor.http.get(url, function (err, res) {
            
            if (typeof res != '' && typeof res != 'undefined' && typeof res.content != 'undefined'){
                annonces_to_import = JSON.parse(res.content);

                var annonces_added = [];
               // Annonces.remove({});
                var date_created = Math.floor(Date.now() / 1000);
                var annonces_to_import_array = [];
                var cpt = 0;
                var cpt2 = 0;
                for(var key_array in annonces_to_import){  

                    var result = Annonces.findOne( { key: annonces_to_import[key_array].key } ) ;
                    var result2 = Annonces.findOne( { url: annonces_to_import[key_array].url } ) ;

                    if(!result && !result2){
                            annonces_to_import_array[key_array] = {
                                price:(annonces_to_import[key_array].price),
                                date:annonces_to_import[key_array].date,
                                date_timestamp:annonces_to_import[key_array].date_timestamp,
                                created:date_created,
                              //  date_ISO8601:annonces_to_import[key_array].date_ISO8601,
                                bedrooms:(annonces_to_import[key_array].bedrooms),
                                garage:annonces_to_import[key_array].garage,
                                url:annonces_to_import[key_array].url,
                                website:annonces_to_import[key_array].website,
                                zip_code:annonces_to_import[key_array].zip_code,
                                //city:annonces_to_import[key_array].city,
                                province:annonces_to_import[key_array].province,
                                key:annonces_to_import[key_array].key, 
                                living_space : annonces_to_import[key_array].living_space,
                                sale : annonces_to_import[key_array].sale,
                                lang: annonces_to_import[key_array].lang
                            };

                            if(annonces_to_import[key_array].need_utf8_decode){
                                annonces_to_import_array[key_array].title = Utf8.decode(annonces_to_import[key_array].title);
                                annonces_to_import_array[key_array].description = Utf8.decode(annonces_to_import[key_array].description);
                                annonces_to_import_array[key_array].location = Utf8.decode(annonces_to_import[key_array].location);
                                annonces_to_import_array[key_array].city = Utf8.decode(annonces_to_import[key_array].city);
                            }else{
                                annonces_to_import_array[key_array].title = annonces_to_import[key_array].title;
                                annonces_to_import_array[key_array].description = annonces_to_import[key_array].description;
                                annonces_to_import_array[key_array].location = annonces_to_import[key_array].location;
                                annonces_to_import_array[key_array].city = annonces_to_import[key_array].city;
                            }

                            Annonces.insert(annonces_to_import_array[key_array]);
                            annonces_added[annonces_added.length] = annonces_to_import_array[key_array];
                            cpt++;

                    }else{
                        if(!result && result2) result = result2;

                        if(typeof result.price != 'undefined'){
                            if(result.price != annonces_to_import[key_array].price){
                                if(!result.old_prices || typeof result.old_prices == 'undefined'){
                                    result.old_prices = [];
                                }
                                result.old_prices.push(result.price);
                                Annonces.update({_id:result._id}, {
                                    $set:{
                                        "old_prices":result.old_prices,
                                        "price": annonces_to_import[key_array].price,
                                        "url":annonces_to_import[key_array].url
                                    }
                                });
                                cpt2 ++;
                             //   annonces_added[annonces_added.length] = annonces_to_import_array[key_array];
                            }

                            
                            var date = new Date();
                            var day = ("0" + (date.getDate())).slice(-2);
                            var month = ("0" + (date.getMonth() + 1)).slice(-2);
                            var date_string = day+"/"+month+"/"+date.getFullYear();


                            if(result.date != date_string){
                                if(!result.old_dates || typeof result.old_dates == 'undefined'){
                                    result.old_dates = [];
                                }
                                
                                result.old_dates.push(result.date);
                                Annonces.update({_id:result._id}, {
                                    $set:{
                                        "old_dates":result.old_dates,
                                        "date_timestamp": date_created,
                                        "date": date_string,
                                        "url":annonces_to_import[key_array].url
                                    }
                                });
                                cpt2 ++;
                            
                                
                               // annonces_added[annonces_added.length] = annonces_to_import_array[key_array];
                            }

                            /*if(result.description != annonces_to_import[key_array].description){
                                Annonces.update({_id:result._id}, {
                                    $set:{
                                        "description":annonces_to_import[key_array].description,
                                        "url":annonces_to_import[key_array].url
                                    }
                                });
                            }*/


                        }
                    }
                   
                }

                if(cpt > 0){
                    notifications.emit('message', cpt+ ' nouvelles annonces ont étés ajoutées', '/annonces', Date.now());
                }
                if(cpt2 > 0){
                    notifications.emit('message', cpt2+ ' nouvelles annonces ont étés modifiées', '/annonces', Date.now());
                }
                if(annonces_added.length > 0){
                    sendMessageForNewAnnonce(annonces_added);     
                }

                
            }else{
                //console.log('ERROR : no import possible');
            }
            
        });
    },

    load_all_annonces_cron: function(max_date) {

        if(typeof max_date == 'undefined'){
            max_date = date.getCurrentDate();
        }

       // var url = "http://localhost/annonces-import/import.php?max_date="+max_date;
        
        var url = Meteor.settings.public.annonces.import_path+max_date;
        Meteor.http.get(url, function (err) {

            Meteor.call('load_all_annonces', function(err, respJson) {
                
            });
           //console.log('err',err);
        });

    },
    delete_all_annonces : function(){
        Annonces.remove({});
        notifications.emit('message', 'Toutes les annonces supprimées', '/annonces', Date.now());
    },
    delete_recents_annonces : function(date){
        Annonces.remove({
            "date_timestamp" : {
                  $gte: parseFloat(date)
            }
        });
    },
    delete_all_old_annonces : function(date){
        Annonces.remove({
             "date_timestamp" : {
                  $lte: parseFloat(date)
              }
        });
    },
    delete_annonce : function(id){
        Annonces.remove({_id:id});
    }
});


function sendMessageForNewAnnonce(annonces_added){   
    var users = Meteor.users.find().fetch();

    for(var i=0;i<users.length;i++){

        if( Roles.userIsInRole(users[i]._id, ['locked']) ) {
            continue;
        }
     
        if(typeof users[i].profile != 'undefined' && typeof users[i].profile.filters != 'undefined' && users[i].profile.filters){
            var filters = users[i].profile.filters;

            for(var j=0;j<filters.length;j++){
                if(filters[j] && typeof filters[j].notification_active != 'undefined' && filters[j].notification_active != null && filters[j].notification_active){
                    
                    var to = users[i].emails[0].address;
                    var results = getAnnoncesFromFilter(filters[j],annonces_added);
                    /*if(to == 'gabypirson@gmail.com'){
                        console.log('filters',filters[j]);
                        console.log('results',results.length);
                    }*/
                    if(results && results.length > 0){
 
                        if(Meteor.settings.public.general.host != 'http://localhost:3000' ){
                            Meteor.call("sendNewOnMyFilter",to,filters[j], results ,function(err, respJson) {
                                if(!err){
                                    //console.log('Mail send');
                                }else{
                                    //console.log('ERROR Mail not send');
                                }
                                
                            });
                        }else{
                            if(to == 'gabypirson@gmail.com'){
                                Meteor.call("sendNewOnMyFilter",to,filters[j], results ,function(err, respJson) {
                                    if(!err){
                                        //console.log('Mail send');
                                    }else{
                                        //console.log('ERROR Mail not send');
                                    }
                                    
                                });
                                console.log('to',to);
                                console.log('filters',filters[j]);
                                console.log('results',results);
                                console.log('---------------------------------------------------------');
                            }
                            
                        }
                    }
                }   
                
            }
        }       
    }
}


function getAnnoncesFromFilter(infos_filter,annonces_added){

    var province = infos_filter.province;
    var price_min = infos_filter.price_min;
    var price_max = infos_filter.price_max;
    var search = infos_filter.input_search;
    var zipcodes = infos_filter.zip_code;
    var lang = infos_filter.lang;

    var sale = true;
    if(typeof infos_filter.sale != 'undefined' ){
        sale = infos_filter.sale;
    }
  

    var annonces_to_send = [];
    
    
    for(var i=0;i<annonces_added.length;i++){

        if(typeof annonces_added[i] != 'undefined'
            && typeof annonces_added[i].province != 'undefined' 
            && typeof annonces_added[i].price != 'undefined' 
            && typeof annonces_added[i].zip_code != 'undefined' 
            && typeof annonces_added[i].title != 'undefined' 
            && typeof annonces_added[i].description != 'undefined' 
        ){


            


            //province
            var send = false;
            if(typeof province == 'undefined' || province == '' || province == null){
                send = true;
            }else{
                for(var y=0;y<province.length;y++){
                    if(province[y] == annonces_added[i].province){
                        send = true;
                    }
                }
            }

            //sale
            if(annonces_added[i].sale != sale ){
                send = false;
            }
           
            //price_min
            if(lang != '' && lang != 'all' && send){
                if(annonces_added[i].lang != lang ){
                    send = false;
                }
            }

            //price_min
            if(price_min != '' && send){
                if(annonces_added[i].price < price_min){
                    send = false;
                }
            }

            //price_max
            if(price_max != '' && send){
                if(annonces_added[i].price > price_max){
                    send = false;
                }
            }

            //zipcode
            if(zipcodes != '' && send){
                var ok = false;
                var zipcodes_in_array = zipcodes.split(' ');
                for(var y=0;y<zipcodes_in_array.length;y++){
                    if(zipcodes_in_array[y] == annonces_added[i].zip_code){
                        ok = true;
                    }
                }
                if(!ok){
                    send = false;
                }
            }

            //search
            /*if(search != '' && send){
                var search_in_array = zipcodes.split(' ');
                ok = false;
                for(var y=0;y<search_in_array.length;y++){
                    if(annonces_added[i].title.indexOf(search_in_array[y]) != -1){
                        ok = true;
                    }
                    if(annonces_added[i].description.indexOf(search_in_array[y]) != -1){
                        ok = true;
                    }
                }
                if(!ok){
                    send = false;
                }
            }*/

            if(send){
                annonces_to_send[annonces_to_send.length] = annonces_added[i];
            }

        }
        
        
    }

    return annonces_to_send;
   
}


/***************************
*       UTILITY
***************************/
var date = {

    getCurrentDate : function(){    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        
        return today;
    },

    timeSince : function (date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

}


var Utf8 = {
  
        // public method for url encoding
        encode : function (string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";
  
                for (var n = 0; n < string.length; n++) {
  
                        var c = string.charCodeAt(n);
  
                        if (c < 128) {
                                utftext += String.fromCharCode(c);
                        }
                        else if((c > 127) && (c < 2048)) {
                                utftext += String.fromCharCode((c >> 6) | 192);
                                utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                                utftext += String.fromCharCode((c >> 12) | 224);
                                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                utftext += String.fromCharCode((c & 63) | 128);
                        }
  
                }
  
                return utftext;
        },
  
        // public method for url decoding
        decode : function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

               
                if(utftext && typeof utftext.length != 'undefined'){
                    while ( i < utftext.length ) {
  
                        c = utftext.charCodeAt(i);
  
                        if (c < 128) {
                                string += String.fromCharCode(c);
                                i++;
                        }
                        else if((c > 191) && (c < 224)) {
                                c2 = utftext.charCodeAt(i+1);
                                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                                i += 2;
                        }
                        else {
                                c2 = utftext.charCodeAt(i+1);
                                c3 = utftext.charCodeAt(i+2);
                                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                                i += 3;
                        }
  
                     }
                }
                
  
                return string;
        }
}



function filter(fiters_infos){
    var province = fiters_infos.province;

    if(!Array.isArray(province) && typeof province != 'undefined' && province != null){
      province = [province];
    }
  
    var price_min = fiters_infos.price_min;
    var price_max = fiters_infos.price_max;

    var search = fiters_infos.input_search;
    var zipcodes = fiters_infos.zip_code;

    var lang = fiters_infos.lang;
    
    var requests = {};

    requests = { $and : [] };
    var list_filter = [];  
    var i = 0;

    /* add zipcodes search */
    if(zipcodes && typeof zipcodes != 'undefined'){
      i++;
      var zipcodes_in_array = zipcodes.split(' ');
      list_filter[i] = {
        $or: [ 
          { "zip_code" : { $in: zipcodes_in_array } },
        ]
      };
    }

    /* add province search */
    if(province && typeof province != 'undefined' && province != ''){
        i++;
        filter_provinces = [];
        for (var j = 0; j < province.length ; j++) {
           filter_provinces[j] = { "province": province[j] }
        }
        list_filter[i] = {
          $or: filter_provinces
        };
    }
  
    /*if(typeof lang != 'undefined' && lang != 'all'){
        i++;
        list_filter[i] = {
          $or: [ 
            { "lang" : lang },
          ]
        };
    }*/

    //delete null element
    for (var i=0;i<list_filter.length;i++) {
        if (list_filter[i] == null || list_filter[i] == '' || typeof list_filter[i] == 'undefined') {
            list_filter.splice(i, 1);
        }
    }
  
    var results = {};
    if(list_filter.length > 0){
      requests.$and = list_filter;
      results = Annonces.find(requests);
    }else{
      results = Annonces.find();
    }

    return results;
    
   
}








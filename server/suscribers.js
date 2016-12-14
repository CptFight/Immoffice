
Subscribers = new Mongo.Collection('subscribers');


Meteor.publish("subscribers", function () {
    return Subscribers.find();
});


Meteor.methods({
    "add_subscriber" : function(email, province) {
        var subscriber = {
            "email" : email,
            "province" : province
        }
        Subscribers.insert(subscriber);                  
    },
    "delete_subscriber" : function(id) {
       Subscribers.remove({_id:id});                 
    },
    "send_to_subscribes" : function() {
       sendMailsToSubscribers();
    }

});


var cron_subscriber = new Cron(3600000); //1 hour

/***************************
*       CRONS
***************************/
// 120 is the number of intervals between invoking the job
// so this job will happen once every 30 minutes
cron_subscriber.addJob(1, function() {
    var now = new Date();
    var hours   = now.getHours();
    if(hours == 1){
        sendMailsToSubscribers();
    }
});


function sendMailsToSubscribers(){

    var provinces = [];
    provinces[provinces.length] = "Liège";
    provinces[provinces.length] = "Bruxelles";
    provinces[provinces.length] = "Luxembourg";
    provinces[provinces.length] = "Namur";
    provinces[provinces.length] = "Anvers";
    provinces[provinces.length] = "Limbourg";
    provinces[provinces.length] = "Flandre orientale";
    provinces[provinces.length] = "Brabant flamand";
    provinces[provinces.length] = "Flandre occidentale";
    provinces[provinces.length] = "Brabant wallon";
    provinces[provinces.length] = "Hainaut";

    for(var i=0;i<provinces.length;i++){
        var annonces_list = searchAnnoncesForThisProvince(provinces[i]);  
        var subscribers = Subscribers.find({'province':provinces[i]}).fetch();

        for(var y=0;y<subscribers.length;y++){
            var filter = {
                'province':provinces[i],
                'price_min' : '',
                'price_max' : '',
                'zip_code' : '',
                'key_words' : ''
            }
            var to = subscribers[y].email;
            if(annonces_list.length > 0)
            Meteor.call("sendNewOnMyFilter",to,filter, annonces_list ,function(err, respJson) {
                if(!err){
          //          console.log('Mail send to :'+to+' '+provinces[i]);
                }else{
                    console.log('ERROR Mail not send to '+to);
                    console.log('filter',filter);
                    //console.log('annonces',annonces);
                   
                }
            });
        }
    }
}



function searchAnnoncesForThisProvince(province){
    var list_filter = [];  
    var requests = {};

    var date = new Date();

    date.setDate(date.getDate() - 1);
    date.setHours(0,0,1);
    var date_min = Math.floor(date / 1000);
    
    date.setHours(23,59,59);
    var date_max = Math.floor(date / 1000);

    list_filter[0] = {
        "province" : province
    };

    list_filter[1] = {
      "created" : {
          $gt: parseFloat(date_min),
          $lte : parseFloat(date_max)
      }
    };

    requests.$and = list_filter;
    var results = Annonces.find(requests);
    return results.fetch();
}

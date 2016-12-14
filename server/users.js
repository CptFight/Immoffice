
/***************************
*       METHODS
***************************/


Meteor.methods({
    "is_there" : function(){
        return true;
    },
 	"change_password_user" : function(userid,newPassword) {
    	Accounts.setPassword(userid, newPassword);
	},
	"set_visited_link" : function(userid,annonceid) {
    	var user = Meteor.users.findOne(userid);
        
        if(!user.profile.visited_links || typeof user.profile.visited_links == 'undefined'){
            user.profile.visited_links = [];
        }

        user.profile.visited_links.push(annonceid);
    	Meteor.users.update({_id:userid}, {
        	$set:{
            	"profile.visited_links":user.profile.visited_links
          	}
	    });
	},
    "set_zipcodes_for_this_user" : function(userid,zipcodes){
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.last_filter.zip_code":zipcodes
            }
        });
    },
    "set_lang_user" : function(userid,lang){
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.lang":lang
            }
        });
    },
    set_zipcodes_for_this_filters_user: function(userid,filter_id,zipcodes){
        var user = Meteor.users.findOne(userid);

        if(!user.profile.filters 
            || typeof user.profile.filters == 'undefined' 
            || typeof user.profile.filters.length == 'undefined' 
            || user.profile.filters.length == 0
        ){
            user.profile.filters = [ {
                "_id" : 0,
                "active_first" : true,
                "province" : null,
                "price_min" : "",
                "price_max" : "",
                "zip_code" : "",
                "notification_active" : false,
                "lang" : "all"
            }, 
            {
                "_id" : 1,
                "active_first" : false,
                "province" : null,
                "price_min" : "",
                "price_max" : "",
                "zip_code" : "",
                "notification_active" : false,
                "lang" : "all"
            }];
        }

        user.profile.filters[filter_id].zip_code = zipcodes;

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.filters":user.profile.filters
            }
        });  

    },
    "set_no_visited_link" : function(userid,annonceid) {
        var user = Meteor.users.findOne(userid);
        
        var i = user.profile.visited_links.indexOf(annonceid);
        if(i != -1) {
          user.profile.visited_links.splice(i, 1);
        }

       // user.profile.visited_links.push(annonceid);
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.visited_links":user.profile.visited_links
            }
        });
    },
    "force_update_user" : function(user_id,infos){
        var emails = [];
        emails[0] = {};
        emails[0].address = infos.login;
        emails[0].verified = false;

        Meteor.users.update({_id:user_id}, {
            $set:{
                "emails" : emails,
                "profile.firstname":infos.firstname,
                "profile.lastname":infos.lastname,
                "profile.agence":infos.agence,
                "profile.tel":infos.tel,
                "profile.adress":infos.adress,
                "profile.owner_email":infos.owner_email,
                "profile.commercial":infos.commercial,
                "profile.service":infos.service,
                "profile.contract_amount":infos.contract_amount
            }
        });    
    },
    "set_admin" : function(user_id,is_admin){
        if(is_admin){
            Roles.addUsersToRoles(user_id, ['admin']);
        }
        else{
            Roles.removeUsersFromRoles(user_id, ['admin']);
        }
    },
    "set_commercial" : function(user_id,is_commercial){
        if(is_commercial){
            Roles.addUsersToRoles(user_id, ['commercial']);
        }else{ 
            Roles.removeUsersFromRoles(user_id, ['commercial']);
        }
    },
    delete_all_users : function(){
        Meteor.users.remove({});
    },
    delete_user : function(user_id){
       Meteor.users.remove({_id:user_id});
    },
    lock_user : function(user_id, lock){
        if(lock)
            Roles.addUsersToRoles(user_id, ['locked']);
        else{
            Roles.removeUsersFromRoles(user_id, ['locked']);
        }
    },
    "add_remark_favoris" : function(userid,annonceid,infos){
        var user = Meteor.users.findOne(userid);

        for(var i=0;i<user.profile.favoris.length;i++){
            if(user.profile.favoris[i]._id == annonceid){
               
                if(typeof user.profile.favoris[i].remarks == 'undefined'){
                    user.profile.favoris[i].remarks = [];
                }

                user.profile.favoris[i].remarks.push(infos);

            }
        }

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favoris":user.profile.favoris,
            }
        });
    },
    "save_info_supp_favoris" : function(userid,annonceid,name_proprio,adress,tel,note){
        var user = Meteor.users.findOne(userid);


        for(var i=0;i<user.profile.favoris.length;i++){
            if(user.profile.favoris[i]._id == annonceid){
                user.profile.favoris[i].tel = tel;
                user.profile.favoris[i].adress = adress;
                user.profile.favoris[i].name_proprio = name_proprio;
            }
        }

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favoris":user.profile.favoris,
            }
        });

        Meteor.call('add_note', userid, annonceid, note,  function(err, respJson) {
          
        });
       
    },
    "add_new_custom_favoris" : function(userid,favoris){
        var user = Meteor.users.findOne(userid);

        if(!user.profile.favoris || typeof user.profile.favoris == 'undefined'){
            user.profile.favoris = [];
        }

        if(typeof user.profile.favorisrepository != 'undefined'){
            user.profile.favorisrepository.push({
                'type':'annonce',
                'id':favoris._id
            });
        }else{
            user.profile.favorisrepository = [];
        }

        user.profile.favoris.push(favoris);
 
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favoris":user.profile.favoris,
                "profile.favorisrepository":user.profile.favorisrepository
            }
        }); 
    },
    "remove_favoris" : function(userid,annonceid) {
        var user = Meteor.users.findOne(userid);

        for(var i=0;i<user.profile.favoris.length;i++){
            if(user.profile.favoris[i]._id == annonceid){
                user.profile.favoris.splice(i, 1);
            }
        }
        
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favoris":user.profile.favoris,
                //"profile.favorisrepository":user.profile.favorisrepository
            }
        });
    },
    "add_favoris" : function(userid,annonceid) {
        var user = Meteor.users.findOne(userid);

        if(!user.profile.favoris || typeof user.profile.favoris == 'undefined'){
            user.profile.favoris = [];
        }

        if(typeof user.profile.favorisrepository != 'undefined'){
            user.profile.favorisrepository.push({
                'type':'annonce',
                'id':annonceid
            });
        }else{
            user.profile.favorisrepository = [];
        }

        var annonce = Annonces.findOne(annonceid);

        user.profile.favoris.push(annonce);

        //user.profile.favoris.push(annonceid);
        
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favoris":user.profile.favoris,
                "profile.favorisrepository":user.profile.favorisrepository
            }
        });    

    },
    "save_favoris_repository" : function(userid,favoris) {
        var user = Meteor.users.findOne(userid);

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favorisrepository":favoris,
            }
        });    

    },
    "transform_old_favoris" : function(){

        var users = Meteor.users.find({}).fetch();
        for(var i=0;i<users.length;i++){
            var user = users[i];
            var favoris_list = [];
            if(typeof user.profile.favoris != 'undefined'){
                for(var j=0;j<user.profile.favoris.length;j++){
                    if(typeof user.profile.favoris[j]._id == 'undefined'){
                        favoris_list[j] = Annonces.findOne(user.profile.favoris[j]);
                    }else{
                        favoris_list[j] = user.profile.favoris[j];
                    }
                }
            }
            Meteor.users.update({_id:users[i]._id}, {
                $set:{
                    "profile.favoris":favoris_list
                }
            }); 
        }
    },
    "remove_remember" : function(userid,annonce_id) {
        var user = Meteor.users.findOne(userid);

        for(var i=0;i<user.profile.remembers.length;i++){
            if(user.profile.remembers[i].annonce_id == annonce_id){
                user.profile.remembers.splice(i, 1);
            }
        }
         

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.remembers":user.profile.remembers
            }
        });
    },
    "add_remember" : function(userid,annonceid) {
        var user = Meteor.users.findOne(userid);

        if(!user.profile.remembers || typeof user.profile.remembers == 'undefined'){
            user.profile.remembers = [];
        }

        var annonce = Annonces.findOne(annonceid);
        if(!annonce){
            for(var i=0;i<user.profile.favoris.length;i++){
                if(user.profile.favoris[i]._id == annonceid){
                    var annonce = user.profile.favoris[i];
                    break;
                }
            }
        }
        user.profile.remembers.push(
            {
                "annonce_id" : annonceid,
                "title" : annonce.title,
                "path" : annonce.url,
                "start" : "",
                "color" : "",
                "start" : "",
                "path" : "",
                "tel" :"",
                "adress" : "",
                "name_proprio" : ""
            }
        );
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.remembers":user.profile.remembers
            }
        });    

    },
    "set_infos_event" : function(user_id,annonce_id,color,title,tel,adress,name_proprio,note,start,path){
        var user = Meteor.users.findOne(user_id);

        if(!user.profile.remembers || typeof user.profile.remembers == 'undefined'){
            user.profile.remembers = [];
        }
 
        for(var i=0;i<user.profile.remembers.length;i++){
            if(user.profile.remembers[i].annonce_id == annonce_id){
                user.profile.remembers[i].color = color;
                user.profile.remembers[i].title = title;
                user.profile.remembers[i].start = start;
                user.profile.remembers[i].note = note;
                user.profile.remembers[i].path = path;
                user.profile.remembers[i].tel = tel;
                user.profile.remembers[i].adress = adress;
                user.profile.remembers[i].name_proprio = name_proprio;
            }
        }
         
        Meteor.users.update({_id:user_id}, {
            $set:{
                "profile.remembers":user.profile.remembers
            }
        });   
    },
    "add_note" : function(userid,annonceid,note) {
        var user = Meteor.users.findOne(userid);
        if(!user.profile.notes || typeof user.profile.notes == 'undefined'){
            user.profile.notes = {};
        }

        user.profile.notes[annonceid] = note;
 
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.notes":user.profile.notes
            }
        });  
    },
    "set_filter_infos" : function(userid,filter_id,filter_infos){
        var user = Meteor.users.findOne(userid);

        if(!user.profile.filters || typeof user.profile.filters == 'undefined'){
            user.profile.filters = [];
        }

        user.profile.filters[filter_id] = filter_infos;

        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.filters":user.profile.filters
            }
        });  

    },
    "reset_user" : function(userid){
       // var user = Meteor.users.findOne(userid);
        var profile = {};
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.favorisrepository": [],
                "profile.favoris": [],
                "profile.filters": [],
                "profile.notes": {},
               // "profile.last_filter" : [],
                "profile.visited_links" : [],
                "profile.remembers" : []
            }
        });  
    },
    "set_last_search" : function(userid,filter_infos){
        var user = Meteor.users.findOne(userid);

        if(!user.profile.last_filter|| typeof user.profile.last_filter == 'undefined'){
            user.profile.last_filter = [];
        }
        user.profile.last_filter = filter_infos;
        Meteor.users.update({_id:userid}, {
            $set:{
                "profile.last_filter":user.profile.last_filter
            }
        });  
    }
});

Meteor.publish("users", function () {
	return Meteor.users.find();
});
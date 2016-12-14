Agences = new Mongo.Collection('agences');
Meteor.subscribe('agences');

Template.users.rendered = function(){
    Session.set("page_title","users");
    // Add slimscroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    });

    $('#users .footable').footable();
//	$('#users #clients-list a').first().trigger('click');
};


Meteor.startup(function() {
  Tracker.autorun(function() {
      search_user(); 
      search_agences();

      setTimeout(function() {
         $('#users table.footable').trigger('footable_redraw');

      }, 100);   
       
  });
});

Template.users.helpers({
    users_list: function(){
        return Session.get('users_list');
    },
    first : function(){
       if(Session.get('users_list')[0]._id == this._id) return true;
       else return false;
    },
    agences_list : function(){
    	return Session.get('agences_list');
    },
    commercials : function(){
        var commercials_list = ['gabypirson@gmail.com','walid.rafiki@gmail.com'];
        return commercials_list;
    },
    count_result : function(){
    	return Session.get('list_count');
    },
    email: function(){
      return this.emails[0].address;
    },
    nbr_visited : function(){
        if(typeof this.profile.visited_links != 'undefined' && typeof this.profile.visited_links.length != 'undefined'){
            return this.profile.visited_links.length;
        }else{
            return 'N/A';
        }  
    },
    nbr_favoris : function(){
        if(typeof this.profile.favoris != 'undefined'){

            var count = 0;
            for (var k in this.profile.favoris) {
                if (this.profile.favoris.hasOwnProperty(k)) {
                   ++count;
                }
            }
            return count;
        }else{
             return 'N/A';
        }  
    },
    nbr_notes : function(){
        if(typeof this.profile.notes != 'undefined'){
            
            var count = 0;
            for (var k in this.profile.notes) {
                if (this.profile.notes.hasOwnProperty(k)) {
                   ++count;
                }
            }
            return count;
        }else{
            return 'N/A';
        }  
    },
    last_login : function(){
        if(typeof this.status != 'undefined' && typeof this.status.lastLogin != 'undefined'){
            return moment(this.status.lastLogin.date).format('D/M/YYYY, h:mm:ss a');
        }else{
            return moment(this.createdAt).format('D/M/YYYY, h:mm:ss a');
        }
    },
    last_browser : function(){
        if(typeof this.status != 'undefined' && typeof this.status.lastLogin != 'undefined'){
            return this.status.lastLogin.userAgent;
        }else{
            return 'N/A';
        }
    },
    firstname: function(){
      return this.profile.firstname;
    },
    tel : function(){
      return this.profile.tel;
    },
    lastname: function(){
      return this.profile.lastname;
    },
    is_lock : function(){
    	return Roles.userIsInRole(this._id, ['locked']);
    },
    adress : function(){
    	return this.profile.address;
    },
    picture : function(){
    	if(typeof this.profile.default_picture != 'undefined'){
    		return Meteor.settings.public.cdn.get_path+this.profile.default_picture;
    	}else return false;
    },
    contract_amount : function(){
        if(typeof this.profile.contract_amount != 'undefined' ){
            return this.profile.contract_amount;
        }else{
            return 0;
        }
    },
    is_admin : function(){
    	return Roles.userIsInRole(this._id, ['admin']);
    },
    is_commercial : function(){
        return Roles.userIsInRole(this._id, ['commercial']);
    },
    agence : function(){
    	return this.profile.agence;
    },
    owner_email : function(){
    	return this.profile.owner_email;
    },
    commercial : function(){
        return this.profile.commercial;
    },
    isserviceselected : function(val){
        if (this.profile.service == val){
            return "selected";
        }
       // return this.profile.service;
    },
    is_connected : function(){
        if(typeof this.status != 'undefined')
            return this.status.online; 
        else return false;
    }, 
    create_date : function(){
        return moment(this.createdAt).format('D/M/YYYY');
    },
    create_date_timestamp : function(){
        return moment(this.createdAt).format('X');
    },
    last_login_timestamp : function(){
        if(typeof this.status != 'undefined' && typeof this.status.lastLogin != 'undefined'){
            return moment(this.status.lastLogin.date).format('X');
        }else{
            return moment(this.createdAt).format('X');
        }
        
    },
    last_search : function(){
        var last_search = '';
        if(typeof this.profile.last_filter != 'undefined'){
            if(typeof this.profile.last_filter.province != 'undefined' && this.profile.last_filter.province != null){
                last_search += this.profile.last_filter.province;
            }
            if(typeof this.profile.last_filter.search != 'undefined'){
                last_search += " "+this.profile.last_filter.search;
            }
            if(typeof this.profile.last_filter.price_min != 'undefined'){
                last_search += " "+this.profile.last_filter.price_min;
            }
            if(typeof this.profile.last_filter.price_max != 'undefined'){
                last_search += " "+this.profile.last_filter.price_max;
            }
            if(typeof this.profile.last_filter.input_search != 'undefined'){
                last_search += " "+this.profile.last_filter.input_search;
            }
            if(typeof this.profile.last_filter.zip_code != 'undefined'){
                last_search += " "+this.profile.last_filter.zip_code;
            }
        }
        
        return last_search;
    },
    my_filter_1 : function(){
        var filter = '';
        try {
            if(typeof this.profile.filters != 'undefined' && this.profile.filters.length > 0){
                if(this.profile.filters[0].province && typeof this.profile.filters[0].province != 'undefined' && this.profile.filters[0].province != null){
                    filter += this.profile.filters[0].province;
                }
                if(typeof this.profile.filters[0].search != 'undefined'){
                    filter += " "+this.profile.filters[0].search;
                }
                if(typeof this.profile.filters[0].price_min != 'undefined'){
                    filter += " "+this.profile.filters[0].price_min;
                }
                if(typeof this.profile.filters[0].price_max != 'undefined'){
                    filter += " "+this.profile.filters[0].price_max;
                }
                if(typeof this.profile.filters[0].input_search != 'undefined'){
                    filter += " "+this.profile.filters[0].input_search;
                }
                if(typeof this.profile.filters[0].zip_code != 'undefined'){
                    filter += " "+this.profile.filters[0].zip_code;
                }
                if(typeof this.profile.filters[0].notification_active != 'undefined' && this.profile.filters[0].notification_active){
                    filter += " - mail activé";
                }else{
                    filter += " - mail désactivé";
                }
            }
        } catch (e) {
           
        }
        
        
        return filter;
    },
    my_filter_2 : function(){
        var filter = '';
        try {
            if(typeof this.profile.filters != 'undefined' && this.profile.filters.length > 1){
                if(this.profile.filters[1].province &&  typeof this.profile.filters[1].province != 'undefined' && this.profile.filters[1].province != null){
                    filter += this.profile.filters[1].province;
                }
                if(typeof this.profile.filters[1].search != 'undefined'){
                    filter += " "+this.profile.filters[1].search;
                }
                if(typeof this.profile.filters[1].price_min != 'undefined'){
                    filter += " "+this.profile.filters[1].price_min;
                }
                if(typeof this.profile.filters[1].price_max != 'undefined'){
                    filter += " "+this.profile.filters[1].price_max;
                }
                if(typeof this.profile.filters[1].input_search != 'undefined'){
                    filter += " "+this.profile.filters[1].input_search;
                }
                if(typeof this.profile.filters[1].zip_code != 'undefined'){
                    filter += " "+this.profile.filters[1].zip_code;
                }
                if(typeof this.profile.filters[1].notification_active != 'undefined' && this.profile.filters[1].notification_active){
                    filter += " - mail activé";
                }else{
                    filter += " - mail désactivé";
                }
            }
         } catch (e) {
           
        }
        
        return filter;
    },
    remembers_count : function(){
        if(typeof this.profile.remembers != 'undefined')
            return this.profile.remembers.length
        else return 0;
    }
});


Template.users.events({
    'click #users .lock-user' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        Meteor.call('lock_user',id, true,   function(err, respJson) {
	         
	    });
    },
    'click #users .save-profile-edit' : function(e,t){
        e.preventDefault();
        var client = $(e.target).closest('tr');      
        var id = $(e.target).data('id');
        var infos = {};


        infos.login = $(client).find('input[name="login"]').val();
        infos.firstname = $(client).find('input[name="firstname"]').val();
        infos.lastname = $(client).find('input[name="lastname"]').val();
        infos.agence = $(client).find('input[name="agence"]').val();
        infos.tel = $(client).find('input[name="tel"]').val();
        infos.adress = $(client).find('input[name="adress"]').val();
        infos.owner_email = $(client).find('input[name="owner_email"]').val();
        infos.commercial = $(client).find('input[name="commercial"]').val();
        infos.service = $(client).find('select[name="service"]').val();
        infos.contract_amount = $(client).find('input[name="contract_amount"]').val();
        Meteor.call('force_update_user', id, infos,   function(err, respJson) {
             if (err){
                toastr["warning"](err.message, "Modification de comptes");
            }else{
                toastr["success"]("Informations modifiées", "Modification de compte");
            }
        });
    },
    'click #users .new-password' : function(e,t){
        e.preventDefault();
        var email = $(e.target).data('email');
        
        Accounts.forgotPassword({email: email}, function(err) {
            if (err){
              if (err.message === 'User not found [403]') {
                toastr["warning"]("Il n'y a pas de compte avec cette email : "+email, "Nouveau mot de passe");
              }else{
                toastr["warning"](err.message, "Nouveau mot de passe");
              }
            }else{
                toastr["success"]("Un email a été envoyé", "Nouveau mot de passe");
            }
        });
    },
    'click #users #clients-list a' : function(e,t){
       // $('html, body').animate({scrollTop: $("#user-detail").offset().top - 100}, 200);
    },
    'click #users .unlock-user' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        
	    Meteor.call('lock_user', id, false,   function(err, respJson) {
	         
	    });
    },
    'click #users .set-admin-false' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        
	    Meteor.call('set_admin', id, false,   function(err, respJson) {
	          console.log('getRolesForUser',Roles.getRolesForUser(id));
	    });
    },
    'click #users .set-admin-true' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        
	    Meteor.call('set_admin', id, true,   function(err, respJson) {
	          console.log('getRolesForUser',Roles.getRolesForUser(id));
	    });
    },
    'click #users .set-commercial-false' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        
        Meteor.call('set_commercial', id, false,   function(err, respJson) {
             console.log('getRolesForUser',Roles.getRolesForUser(id));
        });
    },
    'click #users .reset-user' : function(e,t){
        e.preventDefault();
        var id = $(e.target).data('id');
        if(confirm('Etes-vous sûr de vouloir reset ce compte?')){
             Meteor.call('reset_user', id, true,   function(err, respJson) {

            });
        }
       
    },
    'click #users .set-commercial-true' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).data('id');
        
        Meteor.call('set_commercial', id, true,   function(err, respJson) {
        
        });
    },
    "click #users .delete-client" : function(e,t){
    	var id = $(e.target).data('id');
        
        Meteor.call('delete_user', id,   function(err, respJson) {
	         
	    });
    },
    "click #users .search-client" : function(e,t){
    	e.preventDefault();
    	
    	search_user();
    }, 
    "click #users .delete-agence" : function(e,t){
    	e.preventDefault();
    	var id = $(e.target).data('id');
        
        Meteor.call('delete_agence', id,   function(err, respJson) {
	         
	    });
    }
});

function search_agences(){
	var results = Agences.find();
	Session.set('agences_list',results.fetch());
}

function search_user(){
    
    $("#users .search-client").button('loading');
	var search = $('#users #search-client-input').val();
    var commercial = $('#commercial-input').val();
    
    var payed = $("#payed-input").val();
    var admin = $("#admin-input").val();
    var sub_account = $("#sub_account-input").val();
   
	var requests = { $and : [] };
    var list_filter = [];  
    var i = 0;
    /* add keywords search */
    if(search && typeof search != 'undefined'){
        var search_parts = search.split(' ');
        for (i = 0; i < search_parts.length ; i++) {
          list_filter[i] = {
            $or: [ 
              { "_id": search_parts[i]}, 
              { "emails.address": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} }, 
              { "profile.owner_email": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} }, 
              { "profile.agence": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} }
            ]
          };
        }

       
    }

    switch(sub_account){
        case 'no':
            i++;
            list_filter[i] = {
              $or: [ 
               { $where : "this.profile.owner_email == this.emails[0].address"},
              ]
            };
            break;
        case 'yes':
            i++;
            list_filter[i] = {
              $or: [ 
               { $where : "this.profile.owner_email != this.emails[0].address"},
              ]
            };
            break;
        case 'all':
        default:
            break;
    }
    //if(true){
        
  //  }

    switch(payed){
        case 'no':
            i++;
            list_filter[i] = {
              $or: [ 
               { $where : "this.profile.contract_amount == 0"},
              ]
            };
            break;
        case 'yes':
            i++;
            list_filter[i] = {
              $or: [ 
               { $where : "this.profile.contract_amount > 0"},
              ]
            };
            break;
        case 'all':
        default:
            break;
    }

    switch(admin){
        case 'no':
            i++;
            list_filter[i] = {
              $or: [ 
                { "roles" : { "$nin" : ["admin","commercial"]}},
              ]
            };
            break;
        case 'yes':
            i++;
            list_filter[i] = {
              $or: [ 
                { "roles" : { "$in" : ["admin","commercial"]}},
              ]
            };
            break;
        case 'all':
        default:
            break;
    }
   
  
    if(typeof commercial != 'undefined' && commercial != 'all'){
        i++;
        list_filter[i] = {
          $or: [ 
            { "profile.commercial" : commercial },
          ]
        };
    }

    if(list_filter.length > 0){
      requests.$and = list_filter;
      results = Meteor.users.find(requests);
    }else{
      results = Meteor.users.find();
    }

	Session.set('list_count',results.count());
	Session.set('users_list',results.fetch());

    setTimeout(function() {
        $('#users table.footable').trigger('footable_redraw');
        $("#users .search-client").button('reset');
    }, 200); 
	//$('#users #clients-list a').first().trigger('click');
}

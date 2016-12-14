
Template.myaccounts.rendered = function(){
    Session.set("page_title","my_accounts");
    // Add slimscroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    });


	//$('#myaccounts #clients-list a').first().trigger('click');
};


Meteor.startup(function() {
  Tracker.autorun(function() {
      search_user(); 
  });
});

Template.myaccounts.helpers({
    users_list: function(){
        return Session.get('my_accounts_list');
    },
    count_result : function(){
    	return Session.get('my_accounts_list_count');
    },
    first : function(list, elem){
        if(Session.get('my_accounts_list')[0]._id == this._id) return true;
        else return false;
    },
    email: function(){
      return this.emails[0].address;
    },
    firstname: function(){
      return this.profile.firstname;
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
    is_admin : function(){
    	return Roles.userIsInRole(this._id, ['admin']);
    },
    agence : function(){
    	return this.profile.agence;
    },
    tel : function(){
        return this.profile.tel;
    },
    owner_email : function(){
    	return this.profile.owner_email;
    },
    is_connected : function(){
        if(typeof this.status != 'undefined' )
            return this.status.online; 
        else return false;
    }, 
    create_date : function(){
        return moment(this.createdAt).format('D/M/YYYY');
    }
});


Template.myaccounts.events({
    'click #myaccounts .lock-user' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).closest('.client').data('id');
        Meteor.call('lock_user',id, true,   function(err, respJson) {
	         
	    });
    },
    'click #myaccounts .new-password' : function(e,t){
        e.preventDefault();
        var email = $(e.target).closest('.client').data('email');

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
    'click #myaccounts .unlock-user' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).closest('.client').data('id');
        
	    Meteor.call('lock_user', id, false,   function(err, respJson) {
	         
	    });
    },
    'click #myaccounts #clients-list a' : function(e,t){
        //$('html, body').animate({scrollTop: $("#user-detail").offset().top - 100}, 200);
    },
    'click #myaccounts .set-client' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).closest('.client').data('id');
        
	    Meteor.call('set_admin', id, false,   function(err, respJson) {
	         
	    });
    },
    'click #myaccounts .set-admin' : function(e, t) {
        e.preventDefault();
        var id = $(e.target).closest('.client').data('id');
        
	    Meteor.call('set_admin', id, true,   function(err, respJson) {
	         
	    });
    },
    "click #myaccounts .delete-client" : function(e,t){
    	var id = $(e.target).closest('.client').data('id');
        
        Meteor.call('delete_user', id,   function(err, respJson) {
	         
	    });
    },
    "click #myaccounts .search-client" : function(e,t){
    	e.preventDefault();
    	
    	search_user();
    }
});


function search_user(){
    if(!Meteor.user()) return;
	var search = $('#myaccounts #search-client-input').val();
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
            ]
          };
        }
        
		
    }
    i++;
    list_filter[i] = {
        "profile.owner_email" : Meteor.user().emails[0].address
    }

    requests.$and = list_filter;
    results = Meteor.users.find(requests);

	Session.set('my_accounts_list_count',results.count());
	Session.set('my_accounts_list',results.fetch());

	//$('#myaccounts #clients-list a').first().trigger('click');
}
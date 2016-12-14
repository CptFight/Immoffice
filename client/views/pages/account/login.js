


Template.login.helpers({
	is_disconnected : function(){
		if (Meteor.status().status !== "connected") {
			return true;
		}else{
			return false;
		}
	}, 
	meteor_status : function(){
		return Meteor.status().status;
	},
	connected : function(){
		return Meteor.loggingIn();
	}
});


Template.login.events({

	'submit form' : function(e, t){
  		e.preventDefault();

		/*
		toastr["warning"]("warning", "azdazd");
		toastr["success"]("success", "azdazd");
		toastr["info"]("info", "azdazd");*/
				
  		// retrieve the input field values
  		var email = t.find('#login-email').value;
    	var password = t.find('#login-password').value;

    	// Trim and validate your fields here.... 
    	email = trimInput(email);

    	$("#button-login").button('loading');
	   

	   if (Meteor.status().status !== "connected") {
	   		toastr["error"](translate("connection_to_immoffice_down"), translate("connection"));
	   		$("#button-login").button('reset');
	   }


	   function connexion(email,password){
	   		Meteor.loginWithPassword(email, password, function(err){
	   			$("#button-login").button('reset');
	   	 		if (err){
		    		toastr["error"](err.reason, "Connection");
		    	}else{
		    		if(Roles.userIsInRole(Meteor.user()._id, ['locked']) ){
		    			toastr["error"](translate("user_blocked_message"), translate("connection"));
		    		}else{
		    		//	Meteor.logoutOtherClients();
			    		//toastr["success"]("success", "Connection");


			    		Router.go('/annonces');
		    		}
		    		
		    	}
		  	});
	   }

	   if(Meteor.user()){
	   		if(Meteor.user().emails[0].address != email){
	   			connexion(email,password);
			}else{
				if(Roles.userIsInRole(Meteor.user()._id, ['locked']) ){
	    			toastr["error"](translate("user_blocked_message"), translate("connection"));
	    		}else{
	    			//Meteor.logoutOtherClients();
		    		//toastr["success"]("success", "Connection");
		    		Router.go('/annonces');
	    		}	
			}

	   }else{
	   		connexion(email,password);
	   }

	  
	    return false; 
	}
});


var trimInput = function(val) {
    return val.replace(/^\s+|\s+$/g,'');
}

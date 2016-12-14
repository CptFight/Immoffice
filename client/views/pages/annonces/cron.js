Template.cron.rendered = function(){
	Session.set("page_title","crons");
};

Template.cron.events({
	'click .search-all-button' : function(e, t){
  		e.preventDefault();
  		
  		Meteor.call('load_all_annonces', function(err, respJson) {
			/*if(!err) {
				toastr["success"]("Wait for the server", "Load Annonces");
			}else{
				console.log("ERROR",err);
			}*/
		});


		
	},
	'click .delete-all-today-button' : function(e, t){
		e.preventDefault();
		var one_day_ago = moment().subtract(1, 'days').format("X");
  		if(confirm(translate('sure_delete_today_annonces'))){
  			Meteor.call('delete_recents_annonces', one_day_ago ,function(err, respJson) {
	       
	    	});
  		}
	},
	/*'click .delete-all-users-button' : function(e, t){
  		e.preventDefault();
  		if(confirm(translate('sure_delete_all_users'))){
  			Meteor.call('delete_all_users', function(err, respJson) {
				
			});

  		}
	},*/
	/*'click .delete-all-button' : function(e, t){
  		e.preventDefault();
  		if(confirm('Etes-vous sûr de vouloir supprimer toutes les annonce?')){
  			Meteor.call('delete_all_annonces', function(err, respJson) {
				
			});
  		}
	
	},*/
	'click .delete-all-old-button' : function(e,t){
		var one_month_ago = moment().subtract(1, 'months').format("X");
    	if(confirm(translate('sure_delete_old_annonces'))){
			Meteor.call('delete_all_old_annonces', one_month_ago ,function(err, respJson) {
	       
	    	});
	    }
	},
	'click .search-load_all_annonces_cron' : function(e, t){
  		e.preventDefault();
  		
  		//$(e.target).attr('disabled', true);

  		var max_date = $('#max_date').val();
		var parts = max_date.split("-");

		max_date = parts[2]+"-"+parts[1]+"-"+parts[0];

		Meteor.call('load_all_annonces_cron',max_date, function(err, respJson) {
			/*if(!err) {
				toastr["success"]("Wait for the server", "Load Annonces");
			}else{
				console.log("ERROR",err);
			}*/
		});

	}
});
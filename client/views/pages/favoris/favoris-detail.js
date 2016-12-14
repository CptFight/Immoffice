
Template.favorisdetail.helpers({
	 old_dates_formated : function(){
      if(typeof Template.currentData().old_dates != 'undefined' && Template.currentData().old_dates.length > 3){
        var old_dates_formated = [];
        old_dates_formated[1] = "...";
        for(var i=0;i<Template.currentData().old_dates.length;i++){
          if(i == 0 ){
            old_dates_formated[0] = Template.currentData().old_dates[0];
          }else if( i == Template.currentData().old_dates.length -1 ){
            old_dates_formated[2] = Template.currentData().old_dates[i];
          }
          
        }
        return old_dates_formated;
      }
      return Template.currentData().old_dates;
    },
    format_date : function(timestamp){
    	return moment.unix(timestamp).format('D/M/YYYY, H:mm:ss');
    },
    remarks : function(){
   
      return Session.get('remarks_favoris_detail');
    },
    date_remember : function(){
       if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.remembers == 'undefined'
      ){
        return false;
      }
      var remembers = Meteor.user().profile.remembers;

      for (var j = 0; j < remembers.length ; j++) {
         if(this._id == remembers[j].annonce_id){
         return moment.unix(remembers[j].start).format('LLLL');
         } 
      }
      return translate('add_to_remembers');
    },
    is_remember_active: function(){
      if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.remembers == 'undefined'
      ){
        return false;
      }
      
      var remembers = Meteor.user().profile.remembers;
      for (var j = 0; j < remembers.length ; j++) {
         if(Template.currentData()._id == remembers[j].annonce_id){
          return true;
         } 
      }
      return false;
    }
});

Template.favorisdetail.rendered = function () {
	
	//$('.summernote').summernote({height: 300 });
   $('.summernote').summernote({
      height: 300
    });

   Session.set('remarks_favoris_detail',Template.currentData().remarks);

   var id = Template.currentData()._id;
    var note = '';
    if(
      typeof Meteor.user() == 'undefined' 
      || typeof Meteor.user().profile.notes == 'undefined'
      || typeof Meteor.user().profile.notes[id] == 'undefined'
    ){
      note = '';
    }else{
      note = Meteor.user().profile.notes[id];
    }

  
    $('.note-editable').html(note);
    
};


Template.favorisdetail.events({
  	'click .save_info_supp' : function(e){
      e.preventDefault();
       e.stopPropagation();
  		var annonce_id = $(e.target).data('id');
  		var infos = {
  			name_proprio : $(e.target).closest('form').find('.event-name-proprio').val(),
  			adress : $(e.target).closest('form').find('.event-adress').val(),
  			tel : $(e.target).closest('form').find('.event-tel').val(), 
        note : $(e.target).closest('form').find('.note-editable').html()
  		}
  		
  		Meteor.call('save_info_supp_favoris', Meteor.user()._id,annonce_id, infos.name_proprio,infos.adress,infos.tel,infos.note,  function(err, respJson) {
  		    if(!err) {
            toastr["success"](translate('sucess'), translate('save'));
          }else{
            toastr["error"](translate('error'), translate('save'));
          }
  		});
  	},
    'click .favoris' : function(e){
    	e.preventDefault();
       e.stopPropagation();

       /*swal({
          title: translate('are_you_sure'),
          text: translate('this_is_no_return_action'),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: translate('yes'),
          cancelButtonText: translate('no'),
          closeOnConfirm: true,
          closeOnCancel: true },
          function (isConfirm) {
          if (isConfirm) {*/
              var target = $(e.target);
              var id = $(e.target).data('id');

              if(typeof id == 'undefined' || id == 0){
                  id = $(e.target).closest('a').data('id');
                  target = $(e.target).closest('a');
              }

            
              Session.set('detail_favoris_active',false);
             // $('#list-favoris').nestable().trigger('change');

              Meteor.call('remove_favoris', Meteor.user()._id, id,  function(err, respJson) {
               
              });
         /* }

      });*/

    
	    
    },
    'click .add_remark' : function(e,t){
    	e.preventDefault();
       e.stopPropagation();

       	var infos = {
    		annonce_id : $(e.target).data('id'),
    		remark: $(e.target).closest('form').find('.remark').val(),
    		date:moment().format('X')
    	}
      if(typeof Template.currentData().remarks == 'undefined'){
        Template.currentData().remarks = [];
      }
      Template.currentData().remarks.push(infos);
      Session.set('remarks_favoris_detail',Template.currentData().remarks);
      Meteor.call('add_remark_favoris', Meteor.user()._id, $(e.target).data('id'), infos,  function(err, respJson) {
         
      });

      $(e.target).closest('form').find('.remark').val('');
    },
    'click .remember': function(e,t){
      e.preventDefault();
       e.stopPropagation();
      var target = $(e.target);
      var id = $(e.target).data('id');

      if(typeof id == 'undefined' || id == 0 ){
         id = $(e.target).closest('a').data('id');
         target = $(e.target).closest('a');
      }
     if($(target).hasClass('active')){
        $(target).removeClass('active');
        Meteor.call('remove_remember', Meteor.user()._id, id,  function(err, respJson) {
         
        });
      }else{

       $(target).addClass('active');
        Meteor.call('add_remember', Meteor.user()._id, id,  function(err, respJson) {
        });
      }
 	}
});

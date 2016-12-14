
Session.set('favoris_list_max_number',50);
Session.set('favoris_list_count',0);
Session.set('favoris_list',false);

Template.favorisold.helpers({
    is_visited : function(){
	    if(
	        typeof Meteor.user() == 'undefined' 
	        || typeof Meteor.user().profile.visited_links == 'undefined'
	    ){
	        return false;
	    }
      	var visited_links = Meteor.user().profile.visited_links;

	    for (var j = 0; j < visited_links.length ; j++) {
	        if(this._id == visited_links[j]){
	    	    return true;
	        } 
	    }
      	return false;
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
    price : function(){
      return format_price(this.price);
    },
    annonces_list: function(){
    if(Session.get('favoris_list'))
   	  return  Session.get('favoris_list').slice(0, Session.get('favoris_list_max_number'));
	 else return [];
  },
  is_more_annonces: function(){
      if(Session.get('favoris_list_count') > Session.get('favoris_list_max_number') ){
        return true;
      }else{
        return false;
      }
    },
	old_dates_formated : function(){
      if(typeof this.old_dates != 'undefined' && this.old_dates.length > 3){
        var old_dates_formated = [];
        old_dates_formated[1] = "...";
        for(var i=0;i<this.old_dates.length;i++){
          if(i == 0 ){
            old_dates_formated[0] = this.old_dates[0];
          }else if( i == this.old_dates.length -1 ){
            old_dates_formated[2] = this.old_dates[i];
          }
          
        }
        return old_dates_formated;
      }
      return this.old_dates;
    },
    is_note_exist : function(){
      if(
        typeof Meteor.user() == 'undefined' 
        || typeof Meteor.user().profile.notes == 'undefined'
      ){
        return false;
      }

     
      var notes = Meteor.user().profile.notes;

      if(typeof notes[this._id] != 'undefined') return true;
      else return false;
    
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
         if(this._id == remembers[j].annonce_id){
          return true;
         } 
      }
      return false;
    }
});


function format_price(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
}


Template.favorisold.rendered = function() {
   Session.set("page_title","favoris");
   $('#favoris .footable').footable();
        
   initFavoris();
   $('#favoris .summernote').summernote({height: 300});


   switch(BrowserDetect.browser){
      case 'Safari':
      case 'Explorer':
        
        $('#modal_note').on('shown.bs.modal', function (e) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
          $('.modal-backdrop').hide();
        });
        break;
      default:
      
        break;
    }


   

  

};

function initFavoris(){
    var list_favoris = [];

      if(
          typeof Meteor.user() == 'undefined' 
          || typeof Meteor.user().profile.favoris == 'undefined'
        ){
          return false;
      }
      var favoris = Meteor.user().profile.favoris;
      
      for(var i= 0; i < favoris.length; i++){
        if(typeof favoris[i]._id == 'undefined'){
          var annonce = Annonces.findOne(favoris[i]);
          if(typeof annonce != 'undefined' && annonce){
            list_favoris[i] = annonce;
          }  
        }else{
           list_favoris[i] = favoris[i];
        }
    }

    Session.set('favoris_list',list_favoris.sort(sort_annonce_date));
    Session.set('favoris_list_count',list_favoris.length);
   
    Meteor.call('is_there',   function(err, respJson) {
        $('#favoris table.footable').trigger('footable_redraw'); 
        $('#favoris .incr-max-number').button('reset'); 
    });
   // Session.set("list_favoris",list_favoris);
}

function sort_annonce_date(a,b) {
  if (a.date_timestamp < b.date_timestamp)
    return 1;
  if (a.date_timestamp > b.date_timestamp)
    return -1;
  return 0;
}


Template.favorisold.events({
	'click #favoris .link_website': function(e,t){
		if(typeof this._id == 'undefined'){
	    	var id = $(e.target).data('id');
	  	}else{
	    	var id = this._id;
	  	}
	  	Meteor.call('set_visited_link', Meteor.user()._id, id,   function(err, respJson) { 
	  	});
	},
  	'click #favoris .favoris': function(e,t){
      e.preventDefault();


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
              
              $(target).closest('tr').remove();
              Meteor.call('remove_favoris', Meteor.user()._id, id,  function(err, respJson) {
               
              });
         /* }

         
      });
*/

      
      
  },
	'click #favoris .set-see-it' : function(e,t){
	  if(typeof this._id == 'undefined' || this._id == 0){
	    var id = $(e.target).data('id');
	    if(typeof id == 'undefined'){
	       id = $(e.target).closest('a').data('id');
	    }
	  }else{
	    var id = this._id;
	  }
	  
	  Meteor.call('set_visited_link', Meteor.user()._id, id,   function(err, respJson) {
	     
	  });
	 
	},
  'click #favoris .remember': function(e,t){
      e.preventDefault();
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
  },
  'click #favoris .incr-max-number' : function(e,t){
    e.preventDefault();
    $("#favoris .incr-max-number").button('loading');
    setTimeout(function() {
        Session.set('favoris_list_max_number',Session.get('favoris_list_max_number') + 50);
        initFavoris();
    }, 40);  
  },
	"click #favoris .set-dont-see-it" : function(e,t){
      e.preventDefault();
      if(typeof this._id == 'undefined' || this._id == 0){
        var id = $(e.target).data('id');
        if(typeof id == 'undefined'){
           id = $(e.target).closest('a').data('id');
        }
      }else{
        var id = this._id;
      }

       Meteor.call('set_no_visited_link', Meteor.user()._id, id,   function(err, respJson) {
         
      });
  },
  'click #favoris .export':function(e,t){
    e.preventDefault();

    if(
        typeof Meteor.user() != 'undefined' 
        || typeof Meteor.user().profile.favoris != 'undefined'
      ){
        var favoris = Meteor.user().profile.favoris;
        Session.set('annonces_list_to_export',favoris);
        Router.go('/export');
    }  
  },
	'click #favoris .note': function(e,t){
	    e.preventDefault();
	    var note = '';
	    if(
	      typeof Meteor.user() == 'undefined' 
	      || typeof Meteor.user().profile.notes == 'undefined'
	      || typeof Meteor.user().profile.notes[this._id] == 'undefined'
	    ){
	      note = '';
	    }else{
	      note = Meteor.user().profile.notes[this._id];
	    }


	    $('#modal_note').modal('show');
	    $('#modal_note .save-note').data('id',this._id);
	    $('#modal_note .note-editable').html(note);

	    setTimeout(function() {
	      $('#modal_note .note-editable').focus();
	    }, 300);
	    
	  },
	  
	'click #favoris .save-note': function(e,t){
	    var annonce_id = $('#modal_note .save-note').data('id');
	    var note = $('#modal_note .note-editable').html();
	    
	    Meteor.call('add_note', Meteor.user()._id, annonce_id, note,  function(err, respJson) {
	      
	    });
	    $('#modal_note').modal('hide');
	  }

});
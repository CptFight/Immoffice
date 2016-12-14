
document.allowDrop = function(ev) {
    ev.preventDefault();

}

document.drag = function(ev) {
    ev.dataTransfer.setData("annonce_id", $(ev.target).data('id') );

}

document.drop = function(ev) {
    ev.preventDefault();
    var repository_id = $(ev.target).data('id');
    var annonce_id = ev.dataTransfer.getData("annonce_id");
    
    if(!repository_id || !annonce_id){
      return;
    }

    var favoris = Session.get('favorisrepositories');
    var favori_to_save = false;

    for(var i=0;i<favoris.length;i++){
      switch(favoris[i].type){
        case 'annonce':
          if(favoris[i].id == annonce_id){
            favori_to_save = favoris[i];
            favoris.splice(i, 1);
          }
          break;
        case 'repository':
          if(typeof favoris[i].children != 'undefined'){
            for(var j=0;j<favoris[i].children.length;j++){
              if(favoris[i].children[j].id == annonce_id){
                favori_to_save = favoris[i].children[j];
                favoris[i].children.splice(j, 1);
              }    
            }
          }
          break;
        default:
          break;
      }
    }

    for(var i=0;i<favoris.length;i++){
      if(favoris[i].id == repository_id){
        if(typeof favoris[i].children == 'undefined' || typeof favoris[i].children.length == 'undefined'){
          favoris[i].children = [];
        }
        favoris[i].children.push(favori_to_save);
      }
    }

    Meteor.call('save_favoris_repository', Meteor.user()._id, favoris,   function(err, respJson) { 
        
    });
        
    Session.set('favorisrepositories',favoris);

}


Template.favorismanager.rendered = function() {
   Session.set("page_title","favoris");
   $('#favorismanager .footable').footable();
   $('#favorismanager .summernote').summernote({height: 300});

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


    Session.set('detail_repository_active',false);
    Session.set('detail_favoris_active',false);

    if(Meteor.user() && typeof Meteor.user().profile != 'undefined'){
       Session.set('favorisrepositories',Meteor.user().profile.favorisrepository);
    }



};


Template.favorismanager.events({
  	'click #favorismanager .link_website': function(e,t){
  		if(typeof this._id == 'undefined'){
  	    	var id = $(e.target).data('id');
  	  	}else{
  	    	var id = this._id;
  	  	}
  	  	Meteor.call('set_visited_link', Meteor.user()._id, id,   function(err, respJson) { 
  	  	});
  	},
    'click #favorismanager .exportthis':function(e){
      e.preventDefault();
      e.stopPropagation();
   //   Session.set('annonces_list_to_export',Session.get('annonces_list_favoris_manager'); 
      Router.go('/export');

    },
    'click #favorismanager .repository-edit' : function(e,t){
      e.preventDefault();
     // e.stopPropagation();
      var repository = [];
      

      var id = $(e.target).data('id');
      if(typeof id == 'undefined' || id == 0){
         id = $(e.target).closest('a').data('id');
      }

      var favoris = Session.get('favorisrepositories');
      for(var i=0;i<favoris.length;i++){
        if(favoris[i].type == 'repository' && favoris[i].id == id){
          repository[0] = {
            name : favoris[i].name,
            color : favoris[i].color,
            id : favoris[i].id 
          }
        }
      }

      Session.set('detail_favoris_active',false);
      Session.set('detail_repository_active',repository);
      Session.set('favorisrepositories_selected',id);
     
    },
    'click #favorismanager .save-repository' : function(e){
      e.preventDefault();
      var id = $(e.target).data('id');
      var favoris = Session.get('favorisrepositories');
      for(var i=0;i<favoris.length;i++){
        if(favoris[i].id == id){
           favoris[i].name = $('#name_'+id).val();
           favoris[i].color = $('#color_'+id).val();
        }
      }

      Meteor.call('save_favoris_repository', Meteor.user()._id, favoris,   function(err, respJson) { 
          if(!err) {
            toastr["success"](translate('sucess'), translate('save'));

          }else{
            toastr["error"](translate('error'), translate('save'));
          }
      });

      Session.set('detail_favoris_active',false);
      Session.set('detail_repository_active',false);
      Session.set('favorisrepositories_selected',id);

      Session.set('favorisrepositories',favoris);
    
    },
    'click #favorismanager .delete-repository' : function(e){
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
               var id = $(e.target).data('id');
      
              var favoris = Session.get('favorisrepositories');
              for(var i=0;i<favoris.length;i++){
                if(favoris[i].id == id){
                   favoris.splice(i, 1);
                }
              }

              Meteor.call('save_favoris_repository', Meteor.user()._id, favoris,   function(err, respJson) { 
                  
              });

              Session.set('detail_favoris_active',false);
              Session.set('detail_repository_active',false);

              Session.set('favorisrepositories_selected',false);

              Session.set('favorisrepositories',favoris);
         /* }

      });
*/  
 
    
    },
    'click #favorismanager #new_repository' : function(e,t){
      e.preventDefault();
      if(Meteor.user() ){

        var favoris = Session.get('favorisrepositories');
        if(!favoris || typeof favoris == 'undefined'){
          favoris = [];
        }

        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }

        var cpt = 1;
        for(var i=0;i<favoris.length;i++){
          if(favoris[i].type == 'repository'){
            cpt++;
          }
        }

        favoris.push({
          type: 'repository',
          id : guid()+favoris.length,
          color : '#1ab394',
          name : translate('repository')+' '+cpt
        });
       
      
        Meteor.call('save_favoris_repository', Meteor.user()._id, favoris,   function(err, respJson) { 
            
        });
      
        Session.set('favorisrepositories',favoris);

      }


    },
  	'click #favorismanager .favoris': function(e,t){
      e.preventDefault();
      var target = $(e.target);
      var id = $(e.target).data('id');

      if(typeof id == 'undefined' || id == 0){
         id = $(e.target).closest('a').data('id');
         target = $(e.target).closest('a');
      }

      //$(target).addClass('active');
      //var button = $('button[data="'+this._id+'"');
      
      $(target).closest('tr').remove();
      Meteor.call('remove_favoris', Meteor.user()._id, id,  function(err, respJson) {
       
      });
  
      
  },
  'click #favorismanager .repository': function(e,t){
      e.preventDefault();
     // e.stopPropagation();
      var id = $(e.target).data('id');

      if(typeof id == 'undefined' || id == 0){
         id = $(e.target).closest('a').data('id');
      }

      Session.set('detail_favoris_active',false);
      Session.set('detail_repository_active',false);
      Session.set('favorisrepositories_selected',id);


      setTimeout(function() {
        $('#favorismanager .footable').trigger('footable_redraw'); 
    //    $('#favorismanager .footable').footable(); 
      }, 300);
  

      
  },
	'click #favorismanager .set-see-it' : function(e,t){
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
	'click #favorismanager .favoris_detail' : function(e,t){
	  e.preventDefault();
      var target = $(e.target);
      var id = $(e.target).data('id');
      if(typeof id == 'undefined' || id == 0 ){
         id = $(e.target).closest('a').data('id');
      }

      var favori = [];
      var favoris = Meteor.user().profile.favoris;
      for(var j=0;j<favoris.length;j++){
        if(favoris[j]._id == id){ 
            favori.push(favoris[j]);
            break;
        }
      }

      Session.set('detail_favoris_active',favori);



     
     
	},
  'click #favorismanager .remember': function(e,t){
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
	"click #favorismanager .set-dont-see-it" : function(e,t){
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
  'click #favorismanager .export':function(e,t){
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
	'click #favorismanager .note': function(e,t){
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
	  
	'click #favorismanager .save-note': function(e,t){
	    var annonce_id = $('#modal_note .save-note').data('id');
	    var note = $('#modal_note .note-editable').html();
	    
	    Meteor.call('add_note', Meteor.user()._id, annonce_id, note,  function(err, respJson) {
	      
	    });
	    $('#modal_note').modal('hide');
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


function sort_annonce_date(a,b) {
  if (a.date_timestamp < b.date_timestamp)
    return 1;
  if (a.date_timestamp > b.date_timestamp)
    return -1;
  return 0;
}

Template.favorismanager.helpers({
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
    price : function(){
      return format_price(this.price);
    },
    detail_active : function(){
    	if(typeof Session.get('detail_favoris_active') == 'undefined'){
    		Session.set('detail_favoris_active',false);
    	}
    	return Session.get('detail_favoris_active');
    },
    repository_edit_active : function(){
      if(typeof Session.get('detail_repository_active') == 'undefined'){
        Session.set('detail_repository_active',false);
      }

       return Session.get('detail_repository_active');
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
      },
      repositories : function(){
          var repositories = [];

          if(typeof Session.get('favorisrepositories') != 'undefined'){
              
              for(var i=0;i<Session.get('favorisrepositories').length;i++){
                if(Session.get('favorisrepositories')[i].type == 'repository'){
                  repositories.push(Session.get('favorisrepositories')[i]);
                }
              }
          }
          return repositories;
        
      },
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
      price : function(){
        return format_price(this.price);
      },
      annonces_list: function(){
        var favoris = [];
        if(typeof Session.get('favorisrepositories') != 'undefined' && Meteor.user() && typeof Meteor.user().profile != 'undefined'){
          
        	if(typeof Session.get('favorisrepositories_selected') != 'undefined' && Session.get('favorisrepositories_selected') != false){

            	for(var i=0;i<Session.get('favorisrepositories').length;i++){
    	           if(Session.get('favorisrepositories')[i].type == 'repository'
    	           	&& Session.get('favorisrepositories')[i].id == Session.get('favorisrepositories_selected')){
    	              	
    	           		var favoris_to_push = Session.get('favorisrepositories')[i].children;
                    if(favoris_to_push && typeof favoris_to_push.length != 'undefined'){
                      for(var k=0;k<favoris_to_push.length;k++){
                        var elementPos = Meteor.user().profile.favoris.map(function(x) {return x._id; }).indexOf(favoris_to_push[k].id);
                        if(elementPos != -1){
                            var favori = Meteor.user().profile.favoris[elementPos];
                            favori.id = favori._id;
                            favori.children = [];
                            favoris.push(favori);
                        }
                      }
                    }
    	            }
    	        }
             
           
          }else{
            
          		for(var i=0;i<Session.get('favorisrepositories').length;i++){
    	           if(Session.get('favorisrepositories')[i].type == 'annonce'){
                      var elementPos = Meteor.user().profile.favoris.map(function(x) {return x._id; }).indexOf(Session.get('favorisrepositories')[i].id);
                      if(elementPos != -1){
                         var favori = Meteor.user().profile.favoris[elementPos];
                         favori.id = favori._id;
                         favori.children = Session.get('favorisrepositories')[i].children;
                         favoris.push(favori);
                      }
    	            }
    	        }
             
        	}  
          
        }
        Session.set('annonces_list_to_export',favoris.sort(sort_annonce_date)); 
        return favoris;
    },
    is_favoris : function(){
      if(this.type == 'annonce') return true;
      else return false;
    },
    is_repo_active : function(){
      if(typeof this.id == 'undefined' && !Session.get('favorisrepositories_selected') ){
        return true;
      }

      if(this.id ==  Session.get('favorisrepositories_selected')) return true;
      else return false;
    },
    favoris_rep_list : function(){

       var favorisrepositories = Session.get('favorisrepositories');
       var repositories = [];
       if(typeof favorisrepositories != 'undefined' && Meteor.user() && typeof Meteor.user().profile != 'undefined'){
          for(var i=0;i<favorisrepositories.length;i++){
            switch(favorisrepositories[i].type){
              case 'annonce':
                /*favoris = Meteor.user().profile.favoris;
                for(var j=0;j<favoris.length;j++){
                  if(favoris[j]._id == favorisrepositories[i].id){ 
                    var tmp = favoris[j];
                    //favorisrepositories[i] = favoris[j];
                    tmp.id = favoris[j]._id;
                    tmp.type = 'annonce';
                    tmp.children = favorisrepositories[i].children;
                    favorisfrepositories[i] = tmp;
                  }
                }*/
                break;
              case 'repository':
                repositories[repositories.length] = favorisrepositories[i] ;
                break;
              
              default:
                break;
            }

          }
        }


        return repositories;
    }
});
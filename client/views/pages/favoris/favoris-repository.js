
Session.set('favorisrepositories',[]);


Template.favorisrepository.rendered = function(){

   
   Session.set("page_title","favoris");

    // Log for nestable list
    var updateOutput = function (e) {
        var list = e.length ? e : $(e.target), output = list.data('output');
       // Session.set('favorisrepositories',list.nestable('serialize'));
       
       var serialized = list.nestable('serialize');
       var last_repository_index = false;
       var repository_find = false;

       for(var i=0;i<serialized.length;i++){
        switch(serialized[i].type){
          case 'annonce':
            if(repository_find){
              serialized[last_repository_index].children.push(serialized[i]);
              serialized.splice(i,1);
              i--;
            }
            break;
          case 'repository':
            last_repository_index = i;
            repository_find = true;
            break;
          default:
            break;
        }
        
       }

      Session.set('favorisrepositories',serialized);

      Meteor.call('save_favoris_repository', Meteor.user()._id, serialized,   function(err, respJson) { 
       //  list.nestable('refresh');
      }); 
      
     
    };


     // Activate Nestable for list 2
    $('#list-favoris').nestable({
        group: 1,
        maxDepth : 2
      //  handleClass : 'uk-nestable-handle'
    }).on('change', updateOutput);

    // output initial serialised data
   // updateOutput($('#nestable2').data('output', $('#nestable2-output')));
   if(Meteor.user() && typeof Meteor.user().profile != 'undefined'){
      Session.set('favorisrepositories',Meteor.user().profile.favorisrepository);
   }



    $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });

   
};


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

Template.favorisrepository.helpers({
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
      /*var list_favoris = [];

      if(
          typeof Meteor.user() == 'undefined' 
          || typeof Meteor.user().profile.favoris == 'undefined'
        ){
          return false;
      }
      list_favoris = Meteor.user().profile.favoris;
    
      return list_favoris;*/
      var favoris = [];
      if(typeof Session.get('favorisrepositories') != 'undefined' && Meteor.user() && typeof Meteor.user().profile != 'undefined'){
        for(var i=0;i<Session.get('favorisrepositories').length;i++){
           if(Session.get('favorisrepositories')[i].type == 'annonce'){
                for(var j=0;j<Meteor.user().profile.favoris.length;j++){
                    if(Meteor.user().profile.favoris[j]._id == Session.get('favorisrepositories')[i].id){ 

                        var favori = Meteor.user().profile.favoris[j];
                        favori.id = favori._id;
                        favori.children = Session.get('favorisrepositories')[i].children;
                        favoris.push(favori);
                    }
                }
            }
        }
      }

      return favoris;
  },
  is_favoris : function(){
    if(this.type == 'annonce') return true;
    else return false;
  },
  favoris_rep_list : function(){
     var favorisrepositories = Session.get('favorisrepositories');
     if(typeof favorisrepositories != 'undefined' && Meteor.user() && typeof Meteor.user().profile != 'undefined'){
        for(var i=0;i<favorisrepositories.length;i++){
          switch(favorisrepositories[i].type){
            case 'annonce':
              favoris = Meteor.user().profile.favoris;
              for(var j=0;j<favoris.length;j++){
                if(favoris[j]._id == favorisrepositories[i].id){ 
                  var tmp = favoris[j];
                  //favorisrepositories[i] = favoris[j];
                  tmp.id = favoris[j]._id;
                  tmp.type = 'annonce';
                  tmp.children = favorisrepositories[i].children;
                  favorisrepositories[i] = tmp;
                }
              }
              break;
            case 'repository':

              break;
            default:
              break;
          }

        }
      }
      Session.set('favorisrepositories',favorisrepositories);
      return Session.get('favorisrepositories');
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



Template.favorisrepository.events({
    'click #favorisrepository .more_infos_up' : function(e){
      e.preventDefault();
      var detail_id = $(e.target).data('detail-id');
      if(typeof detail_id == 'undefined'){
         detail_id = $(e.target).closest('a').data('detail-id');
      }

      $('#'+detail_id).addClass('hidden');
      $(e.target).closest('.dd-handle').find('.more_infos_up_container').addClass('hidden');
      $(e.target).closest('.dd-handle').find('.more_infos_down_container').removeClass('hidden');  

    },
    'click #favorisrepository .more_infos_down' : function(e){
      e.preventDefault();
      var detail_id = $(e.target).data('detail-id');

      if(typeof detail_id == 'undefined'){
         detail_id = $(e.target).closest('a').data('detail-id');
      }
     
      $('#'+detail_id).removeClass('hidden');
      $(e.target).closest('.dd-handle').find('.more_infos_up_container').removeClass('hidden');
      $(e.target).closest('.dd-handle').find('.more_infos_down_container').addClass('hidden');


      var parts = detail_id.split('-');
      var favoris_id = parts[1];

      /*var note = '';
      if(
        typeof Meteor.user() == 'undefined' 
        || typeof Meteor.user().profile.notes == 'undefined'
        || typeof Meteor.user().profile.notes[favoris_id] == 'undefined'
      ){
        note = '';
      }else{
        note = Meteor.user().profile.notes[favoris_id];
      }

    
      $('#'+detail_id+' .note-editable').html(note);*/
      
    },
    'click #load_old_favoris' : function(e){
      e.preventDefault();

      if(confirm(translate('sure_load_old_favoris'))){

        var list_favoris = [];
        var favoris = [];
        if(
            typeof Meteor.user() == 'undefined' 
            || typeof Meteor.user().profile.favoris == 'undefined'
          ){
            return false;
        }
        favoris = Meteor.user().profile.favoris;
        for(var i=0;i<favoris.length;i++){
          list_favoris[i] = favoris[i];
          list_favoris[i].id = favoris[i]._id;
          list_favoris[i].type = 'annonce';
          list_favoris[i].children = [];
            
        }

        Session.set('favorisrepositories',list_favoris);
      }

    },
    'click #favorisrepository .export':function(e){
      e.preventDefault();
      var id = $(e.target).data('id');
      if(typeof id == 'undefined'){
         id = $(e.target).closest('a').data('id');
      }

      var favoris = Session.get('favorisrepositories');


      function findFavoris(annonceid){
        var favoris = Meteor.user().profile.favoris;
        for(var i=0;i<favoris.length;i++){
          if(favoris[i]._id == annonceid){
            return favoris[i];
          }
        }
      }
      for(var i=0;i<favoris.length;i++){
        if(favoris[i].id == id ){
          var favoris_to_export = favoris[i].children;
          var annonces_to_export = [];
          if(typeof favoris_to_export != 'undefined' &&  typeof favoris_to_export.length != 'undefined'){
            for(var j=0;j<favoris_to_export.length;j++){
              var annonce = findFavoris( favoris_to_export[j].id ) ;
              annonces_to_export.push(annonce);   
            }
          }
         
        }
      }


      Session.set('annonces_list_to_export',annonces_to_export); 
      Router.go('/export');

    },
    'click #favorisrepository #new_repository' : function(e){
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



        favoris.unshift({
          type: 'repository',
          id : guid()+favoris.length,
          color : '#1ab394',
          name : translate('repository')+' '+cpt
        });
       
      
        Meteor.call('save_favoris_repository', Meteor.user()._id, favoris,   function(err, respJson) { 
            
        });
      
        Session.set('favorisrepositories',favoris);

      }
      
    }

});
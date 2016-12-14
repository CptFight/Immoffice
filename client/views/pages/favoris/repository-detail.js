
Template.repositorydetail.rendered = function () {
	
	$('.summernote').summernote({height: 300 });
 /* $('.color-picker').colorpicker().on('changeColor', function(ev) {
      $('#icon-'+this._id).css('background-color',ev.color.toHex());
  });*/
  $('.color-picker').colorpicker();
};



Template.favorisrepository.events({
    'click .delete-repository' : function(e){
      e.preventDefault();


     /* swal({
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

              Session.set('favorisrepositories',favoris);
          /*}

      });
*/

    },
     'click .save-repository' : function(e){
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
      $(e.target).closest('.repository').find('.more_infos_up').trigger('click');
      Session.set('favorisrepositories',favoris);
 
    
    }
});

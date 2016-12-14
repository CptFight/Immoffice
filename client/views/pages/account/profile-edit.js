Template.profile_edit.rendered = function(){
  //console.log(Meteor.user());
   Session.set("page_title","edit_my_profil");
};

Meteor.startup(function() {

    Dropzone.options.dropzone = { // The camelized version of the ID of the form element

        // The configuration we've talked about above
       // autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 5,
        maxFiles: 5,
        autoDiscover : false,
        acceptedFileTypes : "image/*",
        //headers: {"MyAppname-Service-Type": "Dropzone"},
        paramName: "file",
        url : Meteor.settings.public.cdn.save_path,

        // The setting up of the dropzone
        init: function() {
            var myDropzone = this;

            this.on("sending", function(file, xhr, data) {
                $("button[type=submit]").attr('disabled', true);
            });

            if(typeof Meteor.user() != 'undefined' && typeof Meteor.user().profile.pictures != 'undefined' && Meteor.user().profile.count_picture > 0 ){
                $('#dropzone').removeClass('dz-clickable');
                $('#dropzone').addClass('dz-started');
                
                Meteor.user().profile.pictures.forEach(function(picture,key) {
                    var path = Meteor.settings.public.cdn.get_path+picture;
                    $('#dropzone').append(' '+
                        '<div class="dz-preview dz-processing dz-error dz-image-preview">'+
                            '<div class="dz-details">'+
                                  '<img data-dz-thumbnail="" alt="image002-5.jpg" src="'+path+'"> '+
                            '</div>'+
                            '<div class="dz-error-mark"><span>✘</span></div>'+

                        '</div>'
                    );
                    $('form.profil').append('<input type="hidden" class="picture" name="pictures[]" value="'+picture+'" />');
              
                });

            };
            
            $('.dz-error-mark').click(function(e){
               $(this).closest('.dz-preview').fadeOut().remove();
               //console.log('$(this).index()',$(this).index());
               $("input[type='hidden'].picture").eq($(this).index() -1).remove();
               if($('.dz-preview').length == 0){
                    $('#dropzone').addClass('dz-clickable');
                    $('#dropzone').removeClass('dz-started');
               }
            });
      
        },
        success: function(file, key_pictures){
            key_pictures.forEach(function(picture,key) {
                if(picture.result_code == 200){
                    $('form.profil').append('<input type="hidden" class="picture" name="pictures[]" value="'+picture.id+'" />');
                }
            });
        },
        complete : function (file) {
           $("button[type=submit]").attr('disabled', false);
        }

    }

    $("#dropzone").sortable({
        items:'.dz-preview',
        cursor: 'move',
        opacity: 0.5,
        containment: "parent",
        distance: 20,
        tolerance: 'pointer',
        update: function(e, ui){
            // do what you want
        }
    });

});



Template.profile_edit.events({
    'submit form' : function(e, t) {
        e.preventDefault();

        var password = t.find('#password').value;
        var password_confirm = t.find('#confirm-password').value;

        if(password != '' && (password == password_confirm) ){
            $('#password').closest('.form-group').removeClass('has-error');
            $('#confirm-password').closest('.form-group').removeClass('has-error');
           
            Meteor.call('change_password_user', Meteor.user()._id, password,  function(err, respJson) {
                if(err) {
                    toastr["error"](err.reason, "Change password error");
                }else{
                    toastr["success"]("Success", "Change password");
                }
            });

        }else if(password != '' && (password != password_confirm) ){
            toastr["error"]("Password not match", "Edit profile");
            $('#password').closest('.form-group').addClass('has-error');
            $('#confirm-password').closest('.form-group').addClass('has-error');
            return;
        }else{

            var firstname = t.find('#firstname').value;
            var lastname = t.find('#lastname').value;
            var adress = t.find('#adress').value;
            var agence = t.find('#agence').value;

            var pictures = [];
            var cpt = 0;

            $("input[type='hidden'].picture").each(function(){
                pictures[cpt] = $(this).val(); 
                cpt++;
            });

            var default_picture = pictures[0];
            //default_picture = '';
            
            if(typeof default_picture == 'undefined') default_picture = '';
          
            if(Meteor.users.update({_id:Meteor.user()._id}, {
                $set:{
                    "profile.firstname":firstname,
                    "profile.lastname":lastname,
                    "profile.address":adress,
                    "profile.agence":agence,
                    "profile.pictures":pictures,
                    "profile.count_picture":cpt,
                    "profile.default_picture" : default_picture
                }
            })){
                toastr["success"]("Success", "Edit profile");

            }else{
                toastr["error"]("Error", "Edit profile");
            }   

        }

       

       
    }
});


Template.profile_edit.helpers({
    username: function () {
      if(typeof Meteor.user() != 'undefined')
            return Meteor.user().profile.firstname+" "+Meteor.user().profile.lastname;
        else
            return '';
    },
    firstname: function () {
      if(typeof Meteor.user() != 'undefined')
            return Meteor.user().profile.firstname;
        else
            return '';
    },
    surname: function () {
      if(typeof Meteor.user() != 'undefined')
            return Meteor.user().profile.lastname;
        else
            return '';
    },
    address : function(){
        if(Meteor.user())
            return Meteor.user().profile.address;
        else
            return '';
    },
    key_picture : function(){
        if(Meteor.user())
            return Meteor.user().profile.key_picture;
        else
            return '';
    },
    cdn_save_path : function(){
        return Meteor.settings.public.cdn.save_path;
    }, 
    agence : function(){
        if(Meteor.user())
            return Meteor.user().profile.agence;
        else
            return '';
    }
});



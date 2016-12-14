



 Template.lockScreen.helpers({
    username: function () {
        if(typeof Meteor.user() != 'undefined'){
            return Meteor.user().profile.firstname;
        }else{
            return '';
        }
    	
    },
    profil_picture: function () {     
        if(typeof Meteor.user() != 'undefined' && typeof Meteor.user().profile != 'undefined' && typeof Meteor.user().profile.default_picture != 'undefined'){
            return Meteor.settings.public.cdn.get_path+Meteor.user().profile.default_picture;
        }else{
            return false;
        }
        
    }
  });
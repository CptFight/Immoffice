Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

 
};




 Template.navigation.helpers({
    username: function () {
        if(Meteor.user() 
            && typeof Meteor.user().profile != 'undefined'
        ){
            return Meteor.user().profile.firstname;
        }else{
            return '';
        }
    	
    },
    is_gaby : function(){
         if(Meteor.user()
            && typeof Meteor.user().emails != 'undefined'
            && typeof Meteor.user().emails[0].address != 'undefined'
            && Meteor.user().emails[0].address == 'gabypirson@gmail.com'
        ){
            return true; 
        }else{
            return false;
        }
    },
    is_admin : function(){
        return Roles.userIsInRole(Meteor.userId(), ['admin']);
    },
    is_commercial: function(){
        return Roles.userIsInRole(Meteor.userId(), ['admin']['commercial']);
    },
    is_commercial : function(){
        return Roles.userIsInRole(Meteor.userId(), ['commercial']);
    },
    profil_picture: function () {  
        if(!Meteor.user()) return false;   
        if(typeof Meteor.user() != 'undefined' && typeof Meteor.user().profile != 'undefined' &&  Meteor.user().profile.default_picture != '' &&  typeof Meteor.user().profile.default_picture != 'undefined' ){
            return Meteor.settings.public.cdn.get_path+Meteor.user().profile.default_picture;
        }else{
            return false;
        }
        
    },
    is_owner : function(){
        if(!Meteor.user() || typeof Meteor.user().profile.owner_email == 'undefined') return false;
        if(Meteor.user().profile.owner_email == Meteor.user().emails[0].address) return true;
        else return false;
    },
    count_favoris_2_0 : function(){
        if(
            !Meteor.user()
            || Meteor.user() == 'null'
            || typeof Meteor.user() == 'undefined'
            || typeof Meteor.user().profile == 'undefined'
            || typeof Meteor.user().profile.favorisrepository == 'undefined'
        ){
            return false;
        }else{
            var count = 0;
            var favoris = Meteor.user().profile.favorisrepository;
            for(var i=0;i<favoris.length;i++){
                if(favoris[i].type == 'annonce'){
                    count ++;
                }
            }
            if(count > 0){
                return count;
            }else{
                return false;
            }
           
        }
        
    },
    count_favoris : function(){
        if(
            !Meteor.user()
            || Meteor.user() == 'null'
            || typeof Meteor.user() == 'undefined'
            || typeof Meteor.user().profile == 'undefined'
            || typeof Meteor.user().profile.favoris == 'undefined'
            || typeof Meteor.user().profile.favoris.length == 'undefined'
        ){
            return false;
        }else{
            return Meteor.user().profile.favoris.length;
        }
        
    },
    count_remember: function(){
        if(
            !Meteor.user()
            || Meteor.user() == 'null'
            || typeof Meteor.user() == 'undefined'
            || typeof Meteor.user().profile == 'undefined'
            || typeof Meteor.user().profile.remembers == 'undefined'
        ){
            return false;
        }else{
            var cpt = 0;

            if(
                typeof Meteor.user() == 'undefined' 
                || typeof Meteor.user().profile.remembers == 'undefined'
            ){
                return false;
            }
            var remembers = Meteor.user().profile.remembers;

            for(var i= 0; i < remembers.length; i++){
                if(typeof remembers[i].start == 'undefined' || remembers[i].start == ''){
                    cpt++;
                }
               
            }

            return cpt;

            
        }
    }
  });



// Used only on OffCanvas layout
Template.navigation.events({

    'click #naviguation .close-canvas-menu' : function(){
        $('body').toggleClass("mini-navbar");
    },
    "click #naviguation .active_logout" : function(){
        Meteor.logout(function(err) {
          // callback
        });
    }/*,
    "click #naviguation .sub-menu" : function(e,t){
        //e.preventDefault();
        $("#naviguation .sub-menu").removeClass('active');
        $("#naviguation .sub-menu .nav-second-level").removeClass('in');
       
        $(e.target).addClass('active');
        $(e.target).find('.nav-second-level').addClass('in');
       
    }*/

});
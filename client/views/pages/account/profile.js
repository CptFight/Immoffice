Template.profile.rendered = function(){
    Session.set("page_title","see_my_profil");
    // Set options for peity charts
    $(".line").peity("line",{
        fill: '#1ab394',
        stroke:'#169c81'
    })

    $(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    })

};


 Template.profile.helpers({
    username: function () {
      if(typeof Meteor.user().profile != 'undefined')
            return Meteor.user().profile.firstname+" "+Meteor.user().profile.lastname;
        else
            return '';
    },
    address : function(){
        if(typeof Meteor.user().profile != 'undefined')
            return Meteor.user().profile.address;
        else
            return '';
    },
    profil_picture: function () {     
        if(typeof Meteor.user() != 'undefined' && typeof Meteor.user().profile.default_picture != 'undefined'){
            return Meteor.settings.public.cdn.get_path+Meteor.user().profile.default_picture;
        }else{
            return '';
        }
        
    },
    agence : function(){
        if(Meteor.user())
            return Meteor.user().profile.agence;
        else
            return '';
    }
  });







Template.topNavbar.rendered = function(){

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

    /*
    Meteor.Device.isTV();
    Meteor.Device.isTablet();
    Meteor.Device.isPhone();
    Meteor.Device.isDesktop();
    Meteor.Device.isBot();
    */

   /* if( Meteor.Device.isPhone() ){
        $('#navbar-minimalize').trigger('click');
    }*/
   ;
};


Template.topNavbar.events({

    // Toggle left navigation
    'click #navbar-minimalize': function(event){

        event.preventDefault();

        // Toggle special class
        $("body").toggleClass("mini-navbar");

        // Enable smoothly hide/show menu
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 300);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    },

    "click .active_logout" : function(){
        Meteor.logout(function(err) {
          // callback
        });
    },

    // Toggle right sidebar
    'click .right-sidebar-toggle': function(){
        $('#right-sidebar').toggleClass('sidebar-open');
    },
    'click .choose-lang-fr': function(){
        Session.set("lang","fr");

        Meteor.call('set_lang_user', Meteor.user()._id, 'fr',   function(err, respJson) {
           // console.log('passe fr',Router.current().originalUrl);
          // console.log('err',err);
           // location.reload();
        });
        
    },
    'click .choose-lang-nl': function(){
        Session.set("lang","nl");

        Meteor.call('set_lang_user', Meteor.user()._id, 'nl',   function(err, respJson) {
            //console.log('passe nl',Router.current().originalUrl);
           // location.reload();
        });
        
    }
});



/***************************
*       UTILITY
***************************/
var dateManager = {

    getCurrentDate : function(){    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'-'+mm+'-'+yyyy;
        
        return today;
    },
    
    timeDifference : function(current,previous) {
        
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        
        var elapsed = current - previous;
        
        if (elapsed < msPerMinute) {
             return Math.round(elapsed/1000) + ' seconds ago';   
        }
        
        else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
        
        else if (elapsed < msPerDay ) {
             return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
             return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
        }
        
        else if (elapsed < msPerYear) {
             return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
        }
        
        else {
             return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

}

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'
});

//ERROR A RETIRER PLUS TARD
Router.route('/dashboard1',function(){ });
Router.route('/notifications',function(){ });
Router.route('/gridOptions',function(){ });
Router.route('/mailbox',function(){ });


// RESTRICT ACCESS
var OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        Router.go('landing');
        //this.pause();
      }else {
        this.next();
      }

    },

    notBlocked : function(pause){
        if(Roles.userIsInRole(Meteor.userId(), ['locked'])){
            Router.go('landing');
        }else{
             this.next();
        }
    }

};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except : [
        'landing'
    ]
});

Router.onBeforeAction(OnBeforeActions.notBlocked, {
    except : [
        'landing'
    ]
});

//
// Dashboards routes
//

Router.route('/map', function () {
   this.render('map');
});

Router.route('/export', function () {
   this.render('export');
});




Router.route('/subscribers', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        this.render('subscribers');
    }else{
        this.render('lockScreen');
    }
});

Router.route('/dashboard', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        this.render('dashboard');
    }else{
        this.render('lockScreen');
    }
});

Router.route('/admin', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        this.render('admin');
    }else{
         this.render('lockScreen');
    }
    
});

Router.route('/news', function(){
    this.render('newsTimeline');
    
});

Router.route('/users', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        this.render('users');
    }else{
        this.render('lockScreen');
    }
    
});


Router.route('/myaccounts', function () {
    this.render('myaccounts');
});


Router.route('/upload', function () {
    this.render('formUpload');
});


Router.route('/login', function () {
    /*this.render('login');
    this.layout('website');*/
    Router.go('landing');
});

Router.route('/recoverPassword', function () {
    this.render('recoverPassword');
    this.layout('blankLayout');
});

Router.route('/chat', function () {
    this.render('chatView');
});


Router.route('/register', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','commercial'])){
        this.render('register');
    }else{
         this.render('lockScreen');
    }
   
    //this.layout("blankLayout");
    //this.layout('website');
    //Router.go('landing');
});



Router.route('/profile', function () {
   this.render('profile');
});

Router.route('/profile-edit', function () {
   this.render('profile_edit');
});


Router.route('/calendar', function () {
    this.render('calendar');
});



Router.route('/newfavoris', function () {
    this.render('newfavoris');
});



Router.route('/favoris', function () {
    this.render('favorisold');
});

Router.route('/favorismanager', function () {
    this.render('favorismanager');
});

Router.route('/favorisrepository', function () {
    this.render('favorisrepository');
});


/*
Router.route('/favorisrepository', function () {
    this.render('favorisrepository');
});
*/


Router.route('/annonces', function () {
    this.render('annonces');
});

Router.route('/myfilters', function () {
    //this.render('lockScreen');
    this.render('myfilters');
});

Router.route('/cron', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        this.render('cron');
    }else{
       this.render('lockScreen');
    }
   // this.render('cron');
});

Router.route('/suggestions', function () {
    this.render('suggestions');
});


Router.route('/searchResult', function () {
    this.render('searchResult');
});

Router.route('/lockScreen', function () {
    this.render('lockScreen');
    this.layout('blankLayout')
});

Router.route('/emptyPage', function () {
    this.render('emptyPage');
});

//
// Landing page
//

Router.route('/landing', function () {
    this.render('landing');
    this.layout('blankLayout')
});

//
// Other pages routes
//
Router.route('/notFound', function () {
    Router.go('landing');
    //this.render('notFound');
});

// Default route
// You can use direct this.render('template')
// We use Router.go method because dashboard1 is our nested view in menu
Router.route('/', function () {
    this.render('landing');
    this.layout('blankLayout')
});


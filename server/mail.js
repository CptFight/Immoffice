


Meteor.startup(function() {
  process.env.MAIL_URL = 'smtp://gabypirson@gmail.com:1ELgFDYXhGx7APjMJMuapQ@smtp.mandrillapp.com:587';

  SSR.compileTemplate('suggestions',Assets.getText('email_templates/suggestions.html'));
  SSR.compileTemplate('myfilters',Assets.getText('email_templates/myfilters.html'));


  //console.log('MONGO_URL' , process.env.MONGO_URL);
  Accounts.emailTemplates.resetPassword.from = function(){ return "no-reply@immoffice.be"; }

});


Meteor.methods({
  sendSuggestion : function(email,message){
     var data = {
        message : message,
        email : email,
        host : Meteor.settings.public.general.host
      }
     
      var html = SSR.render("suggestions",data);

      var options = {
        from:"no-reply@immoffice.be",
        to:'gabypirson@immoffice.be',
        subject:'Suggestion from IMMOffice',
       // html:html
        html : message
      }

      this.unblock();
      Email.send(options);

  },
  sendNewOnMyFilter: function (to,infos_filter,annonces) {
      if(typeof infos_filter.sale != 'undefined' && !infos_filter.sale){
        var sale = 'Location';
      }else{
        var sale = 'Vente';
      }
      var data = {
        cpt_annonce : annonces.length,
        province : infos_filter.province,
        price_min : infos_filter.price_min,
        price_max : infos_filter.price_max,
        zip_code : infos_filter.zip_code,
        lang : infos_filter.lang,
        sale : sale,
        key_words : infos_filter.input_search,
        annonces : annonces,
        host : Meteor.settings.public.general.host
      }
     
      var html = SSR.render("myfilters",data);

      var options = {
        from:'no-reply@immoffice.be',
        to:to,
        subject:'De nouvelles annonces correspondent à vos recherches',
        html:html
      }
      this.unblock();
      Email.send(options);
  }

  
});
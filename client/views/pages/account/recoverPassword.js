
if(Meteor.isClient){
  Template.recoverPassword.rendered = function(){
    if (Accounts._resetPasswordToken){
      Session.set('resetPassword', Accounts._resetPasswordToken);
    }

    console.log('test',Accounts);
  }

  Template.recoverPassword.helpers({
    resetPassword: function(){
      return Session.get('resetPassword') || false;
    }
  });

  Template.recoverPassword.events({
    'submit form': function(event, template){
      event.preventDefault();
    
      var email = template.find('#recover-email').value.trim();

    
      Accounts.forgotPassword({email: email}, function(err) {
        if (err){
          if (err.message === 'User not found [403]') {
          	toastr["warning"](translate('not_account_with_this_email'),translate('forgot_password'));
          }else{
            toastr["warning"](err.message, translate('recover_password'));
          }
        }else{
        	toastr["success"](translate('email_is_send'), translate('forgot_password'));
        }
      });
    }
    
  });
}
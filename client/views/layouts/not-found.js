

Template.notFound.rendered = function(){

     toastr["error"](translate('not_found'), translate('redirect_in_5_sec'));

      setTimeout(function() {
       Router.go('/login');
      }, 5000);
}
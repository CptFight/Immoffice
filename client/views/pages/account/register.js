 

Template.register.events({
  'submit form' : function(e, t) {
    e.preventDefault();
    var email = t.find('#email').value
    var password = t.find('#password').value;
   
    // Trim and validate the input
    if(isValidPassword(password)){

       Meteor.call('add_agence', t.find('#agence').value,   function(err, respJson) {
            
       });

       var owner_email = t.find('#owner_email').value;
       if(owner_email == '') owner_email = email;

       Accounts.createUser({
        email: email, 
        password : password,
        profile  : {
            //publicly visible fields like firstname goes here
            firstname: t.find('#name').value,
            lastname : t.find('#surname').value,
            address : t.find('#address').value,
            agence : t.find('#agence').value,
            tel : t.find('#tel').value,
            owner_email : owner_email,
            commercial : t.find('#commercial').value,
            service : t.find('#service').value,
            contract_amount : t.find('#contract_amount').value,
            remembers : [],
            favoris : [],
            favorisrepository : [],
            last_filter : [],
            filters : [],
            notes : [],
            visited_links : []
        }

      }, function(err, response){
        if (err) {
          toastr["error"](err.reason, "Register");
        } else {
            toastr["success"](translate('success'), translate('connection'));
           // Router.go('/annonces');
        }

      });
    }else{
      toastr["error"](translate('password_not_valid'), translate('register'));
    }
    

    return false;
  }
});


var isValidPassword = function(val) {
  return (val.length >= 6) ? true : false; 
}



Template.register.rendered = function(){
    Session.set("page_title","register");
    // Initialize steps plugin
    $("#wizard").steps();

    $("#form").steps({
        bodyTag: "fieldset",
        labels: {
            cancel: translate('cancel'),
            current: translate('current'),
            pagination: translate('pagination'),
            finish: translate('finish'),
            next: translate('next'),
            previous: translate('previous'),
            loading: translate('loading')
        },
        onStepChanging: function (event, currentIndex, newIndex)
        {
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex)
            {
                return true;
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex)
            {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {

            // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
            if (currentIndex === 2 && priorIndex === 3)
            {
                $(this).steps("previous");
            }
        },
        onFinishing: function (event, currentIndex)
        {
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            
            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
            var form = $(this);

            // Submit form input
            form.submit();
        }
    }).validate({
        errorPlacement: function (error, element)
        {
            element.before(error);
        },
        rules: {
            confirm: {
                equalTo: "#password"
            }
        }
    });

};

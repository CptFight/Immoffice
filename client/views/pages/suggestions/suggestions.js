

Template.suggestions.rendered = function () {
	Session.set("page_title","suggestions");
    // Initialize summernote plugin
    $('#suggestions .summernote').summernote({height: 300});

};



Template.suggestions.events({

	'click #send_mail': function(e){
		e.preventDefault();

		
		var text = $('.note-editable').html();
		//var email = $('#email').val();
		if(Meteor.user() && typeof Meteor.user().emails != 'undefined'){
			var email = Meteor.user().emails[0].address;

			if(validate_email() && validate_required()){
				Meteor.call("sendSuggestion",email,text,function(err, respJson) {
	        		if(!err) {
						toastr["success"](translate(thanks_for_the_remark), translate(thanks));
					}else{
						toastr["error"]("Contactez gabypirson@gmail.com ! ", "Oups problème");
					}
				});
			}
		}else{
			toastr["error"](translate(your_are_not_connected), translate('connection'));
		}
		
		
	}

});


function validate_email(){
	var is_good = true;
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
	$("input[type='email']").each(function(){
		var val = $(this).val();
		if(!reg.test(val)){
			is_good = false;
			setError(this);
		}	
	});
	return is_good;
}

function validate_required() {
	var is_good = true;
	$('input[type=text][required], input[type=email][required], textarea[required], select[required]').each(function(){			
		if( $(this).val() == '' || $(this).val() == $(this).attr('placeholder') ){
			if($(this).attr('required')){
				setError(this);
				is_good = false;
			}else{
				setWarning(this);
			}
		}else{
			setSuccess(this);
		}	
	});

	$("input[type='checkbox'][required]").each(function(){
		if(!$(this).is(":checked")){
			if($(this).attr('required')){
				setError(this);
				is_good = false;
			}else{
				//setWarning(this);
			}
		}else{
			setSuccess(this);
		}
	});
	return is_good;
}

function setError(who){
	$(who).closest(".form-group").removeClass('has-warning');
	$(who).closest(".form-group").removeClass('has-success');
	$(who).closest(".form-group").addClass('has-error');
}

function setSuccess(who){
	$(who).closest(".form-group").removeClass('has-warning');
	$(who).closest(".form-group").addClass('has-success');
	$(who).closest(".form-group").removeClass('has-error');
}




Session.set("website_title","Immoffice");
Session.set("page_title","home");
Session.set("lang","fr");

Deps.autorun(function(){
  document.title = Session.get("website_title")+" | "+Session.get("page_title");

});

Meteor.startup(function() {
	//Tracker.autorun(function() {
	if(Meteor.user() && typeof Meteor.user().profile.lang != 'undefined'){
		Session.set("lang",Meteor.user().profile.lang);
		
    }
  //	});
	
});

Template.registerHelper('translate', function(value) {
	return translate(value);
});

translate = function(value){
	if(typeof Session.get("labels_"+Session.get("lang"))[value] != 'undefined'){
		return Session.get("labels_"+Session.get("lang"))[value];
	}else{
		return value;
	}
}




	

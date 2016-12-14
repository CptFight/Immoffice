Template.pageHeading.helpers({

    home: function(){
    	return 'annonces';
    },
    title : function(){
    	return translate(Session.get('page_title'));
    }

});
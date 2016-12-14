Template.newfavoris.rendered = function(){
  //console.log(Meteor.user());
   Session.set("page_title","new favoris");

    $('#newfavoris .summernote').summernote({height: 300});
};



Template.newfavoris.events({
    'submit form' : function(e, t) {
        e.preventDefault();

        
        var date = new Date();
        var date_timestamp = Math.floor(Date.now() / 1000);
        var day = ("0" + (date.getDate())).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var date_string = day+"/"+month+"/"+date.getFullYear();

        var objectId = new Meteor.Collection.ObjectID();

        var new_custom_favoris = {
            "_id" : objectId._str,
            "price" : t.find('#price').value,
            "date" : date_string,
            "date_timestamp" : Math.floor(Date.now() / 1000),
            "created" : Math.floor(Date.now() / 1000),
            "bedrooms" : 0,
            "garage" : "",
            "url" : "#",
            "website" : "Immoffice",
            "zip_code" : t.find('#zipcode').value,
            "province" : t.find('#province').value,
            "key" : "#",
            "living_space" : "",
            "sale" : true,
            "tel" : t.find('#tel').value,
            "lang" : "fr",
            "title" : t.find('#title').value,
            "description" : t.find('#description').value,
            "location" : t.find('#location').value,
            "adress" : t.find('#location').value,
            "name_proprio" : t.find('#owner_name').value,
            "city" : t.find('#city').value,
            "old_dates" : [ 
               
            ]
        }
        
      
        Meteor.call('add_new_custom_favoris', Meteor.user()._id, new_custom_favoris,   function(err, respJson) { 
        	toastr["success"]("Success", "Save favoris");
        	Router.go('/favoris');
    	});
              
    }
});

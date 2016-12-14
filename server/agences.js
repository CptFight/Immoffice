Agences = new Mongo.Collection('agences');


Meteor.publish("agences", function () {
    return Agences.find();
});


Meteor.methods({
  add_agence : function(name){
  	var finded_agence = Agences.findOne({"name" : name});
  	if(!finded_agence){
  		var agence = {};
	  	agence.name = name;

	  	var id = Agences.insert(agence);
	  	return id;
  	}else{
  		return finded_agence._id;
  	}
  	
  }, 
  delete_agence: function(agence_id){
  	 Agences.remove({_id:agence_id});
  }
});
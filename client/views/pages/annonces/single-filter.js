

Template.single_filter.helpers({
    annonces_list_count: function(){
    	return Session.get('annonces_list_count_'+this._id);
    },
    resum_criteres : function(){
      return Session.get('resum'+this._id);
    },
    is_phone : function(){
      return Meteor.Device.isPhone();
    },
    filter_id : function(){
      return Template.currentData()._id;
    }
});

Template.single_filter.rendered = function() {

  var id = Template.currentData()._id;

  	var config = {
      '.chosen-select' : {
        'width' : '100%'
      }  
  	}
  	for (var selector in config) {
      $(selector).chosen(config[selector]);
  	}
  	   
   	initValues();
  
}

function initValues(){
     if(typeof Template == 'undefined' || typeof Template.currentData() == 'undefined') return;
      var id = Template.currentData()._id;
      var date_min = parseFloat(Template.currentData().date_min);
      //var date_max = parseFloat(Template.currentData().date_max);

    
      $('#filter-'+id+' #province').val(Template.currentData().province);
      $('.chosen-select').trigger('chosen:updated');

      $('#filter-'+id+' #price-min').val(Template.currentData().price_min);
      $('#filter-'+id+' #price-max').val(Template.currentData().price_max);
      $('#filter-'+id+' #input-search').val(Template.currentData().input_search);
      $('#filter-'+id+' #input-zipcode').val(Template.currentData().zip_code);

      if(typeof Template.currentData().notification_active != 'undefined' && Template.currentData().notification_active){
        $('#filter-'+id+' #notification_active').prop('checked', true);
      }else{
        $('#filter-'+id+' #notification_active').prop('checked', false);
      }
       
     jQuery("#filter-"+id+" input[name='lang'][value='"+Template.currentData().lang+"']").attr('checked', 'checked');
     
     var sale = 'location';
      if(Template.currentData().sale){

       var sale = 'sell';
      }
     jQuery("#filter-"+id+" input[name='sell_location'][value='"+sale+"']").attr('checked', 'checked');
   
      
}

Template.single_filter.events({
  'click .map-link': function(e,t){
    Session.set('map_target','myfilters');
    Session.set('map_target_id',this._id);
    
  },
	'click .save-button' : function(e, t){
  		e.preventDefault();
  	
      setTimeout(function() {
          $('#filter-'+this._id+' .single-filter table.footable').trigger('footable_redraw'); 
      }, 300);
      
      var province = $('#filter-'+this._id+' #province').val();
	    var price_min = $('#filter-'+this._id+' #price-min').val();
	    var price_max = $('#filter-'+this._id+' #price-max').val();
	    var search = $('#filter-'+this._id+' #input-search').val();
	    var zipcodes = $('#filter-'+this._id+' #input-zipcode').val();
      var lang = $("#filter-"+this._id+" input[name='lang']:checked").val();
      var sale = $("#filter-"+this._id+" input[name='sell_location']:checked").val();

      switch(sale){
        case 'location':
          sale = false;
          break;
        default : 
          sale = true;
          break;
      }
     
      var notification_active = false;
      if($('#filter-'+this._id+' #notification_active').is(':checked')){
        notification_active = true;
      }
    

      var active_first = false;
      if(this._id == 0){
         active_first = true;
      }
      var filter_infos = {
        _id : this._id,
        active_first : active_first,
      	province : province,
      	price_min : price_min,
      	price_max : price_max,
      	input_search : search,
      	zip_code : zipcodes,
        notification_active : notification_active,
        lang : lang,
        sale : sale
      }

     
      Meteor.call('set_filter_infos', Meteor.user()._id, this._id, filter_infos,   function(err, respJson) {
        if (err){
            toastr["error"](err.reason, "Sauvegarde recherche");
        }else{
            toastr["success"]("Recherche sauvegardée", "Sauvegarde recherche");
        }
      });
 	},
  'click .search-button' : function(e, t){
      e.preventDefault();
      $('#filter-'+this._id+' .save-button').trigger('click');
      Session.set('annonces_list',Session.get('annonces_list'+this._id));
      Session.set('annonces_list_count',Session.get('annonces_list_count_'+this._id));

      var filter_infos = {
        province : $('#filter-'+this._id+' #province').val(),
        date_min : $('#filter-'+this._id+' #date-min').val(),
        date_max : $('#filter-'+this._id+' #date-max').val(),
        price_min : $('#filter-'+this._id+' #price-min').val(),
        price_max : $('#filter-'+this._id+' #price-max').val(),
        input_search : $('#filter-'+this._id+' #input-search').val(),
        zip_code : $('#filter-'+this._id+' #input-zipcode').val(),
        sale : $("input[name='sell_location']:checked").val()
    
      }

      if(Meteor.user() && Meteor.user() != null && typeof Meteor.user() != 'undefined'){
        Meteor.call('set_last_search', Meteor.user()._id, filter_infos,   function(err, respJson) {
          Router.go('/annonces');
        });
      }

      
  }
});
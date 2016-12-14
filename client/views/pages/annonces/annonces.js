

Annonces = new Mongo.Collection('annonces');


const handle = Meteor.subscribe('annonces');

/*
Tracker.autorun( function() { 
  const isReady = handle.ready();
  if(isReady){
    initValuesAnnonces();
  }
 // console.log('Handle is ${isReady ? 'ready' : 'not ready'}');  
} );*/


Session.set('annonces_list',false);
Session.set('annonces_list_count',0);
Session.set('annonces_list_max_number',50);

function initValuesAnnonces(){

      var date_min = false;
      var date_max = false;
      var province = '';
      var price_min = '';
      var price_max = '';
      var input_search = '';
      var zipcodes = '';
      var lang = 'fr';
      var sale = 'sale';

    if(Meteor.user() && typeof Meteor.user().profile.last_filter != 'undefined'){
      date_min = Meteor.user().profile.last_filter.date_min;
      //Meteor.user().profile.last_filter.date_max);
      province = Meteor.user().profile.last_filter.province;
      price_min = Meteor.user().profile.last_filter.price_min;
      price_max = Meteor.user().profile.last_filter.price_max;
      input_search = Meteor.user().profile.last_filter.input_search;
      zipcodes = Meteor.user().profile.last_filter.zip_code;
      lang = Meteor.user().profile.last_filter.lang;
      sale = Meteor.user().profile.last_filter.sale;
    }

    jQuery("input[name='lang'][value='"+lang+"']").attr('checked', 'checked');
    jQuery("input[name='sell_location'][value='"+sale+"']").attr('checked', 'checked');
    
      if(!date_min){
        date_min = moment().subtract(1, 'days').format("X");
      }

      if(!date_max){
        date_max = moment().format("X");
      }


     var today_label = translate('today');
     var two_days_ago = translate('two_days_ago');
     var one_week_ago = translate('one_week_ago');
     var one_month_ago = translate('one_month_ago');
     var since_begin_of_the_month = translate('since_begin_of_the_month');
     
     var ranges = [
        today_label,
        two_days_ago,
        one_week_ago,
        one_month_ago,
        since_begin_of_the_month
      ];

      ranges[today_label] = [moment(), moment()];
      ranges[two_days_ago] = [moment().subtract(1, 'days'), moment()];
      ranges[one_week_ago] = [moment().subtract(6, 'days'), moment()];
      ranges[one_month_ago] = [moment().subtract(29, 'days'), moment()];
      ranges[since_begin_of_the_month] = [moment().startOf('month'), moment().endOf('month')];

      $('#reportrange').daterangepicker({
        format: 'DD/MM/YYYY',
        startDate: moment.unix(date_min),
        endDate: moment.unix(date_max),
        minDate: '01/01/2016',
        maxDate: '12/31/2019',
        dateLimit: { days: 60 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: ranges,
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: translate('separator'),
        locale: {
            applyLabel: translate('submit'),
            cancelLabel: translate('cancel'),
            fromLabel: translate('from'),
            toLabel: translate('to'),
            customRangeLabel: translate('custom'),
            daysOfWeek: [translate('week_7_small'),translate('week_1_small'), translate('week_2_small'), translate('week_3_small'), translate('week_4_small'), translate('week_5_small'), translate('week_6_small')],
            monthNames: [translate('month_1'), translate('month_2'), translate('month_3'), translate('month_4'), translate('month_5'), translate('month_6'), translate('month_7'), translate('month_8'), translate('month_9'), translate('month_10'), translate('month_11'), translate('month_12')],
            firstDay: 1
        }
    }, function(start, end, label) {
        if(Meteor.Device.isPhone() ){
           $('#annonces #reportrange span').html(start.format('M/D/YYYY') + ' - ' + end.format('M/D/YYYY'));
        }else{
           $('#annonces #reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        $('#annonces #date-min').val(start.hours(0).minutes(0).seconds(0).format("X"));
        $('#annonces #date-max').val(end.hours(22).minutes(59).seconds(59).format("X"));
    });

      //set date_min to today;
      if(Meteor.Device.isPhone() ){
        $('#annonces #reportrange span').html(moment.unix(date_min).format('M/D/YYYY') + ' - ' + moment.unix(date_max).format('M/D/YYYY'));
      }else{
        $('#annonces #reportrange span').html(moment.unix(date_min).format('MMMM D, YYYY') + ' - ' + moment.unix(date_max).format('MMMM D, YYYY'));
      }
      
      $('#annonces #date-min').val(moment.unix(date_min).hours(0).minutes(0).seconds(0).format("X"));
      $('#annonces #date-max').val(moment.unix(date_max).hours(22).minutes(59).seconds(59).format("X"));
   
      $('#annonces #province').val(province);
      $('.chosen-select').trigger('chosen:updated');

      $('#annonces #price-min').val(price_min);
      $('#annonces #price-max').val(price_max);
      $('#annonces #input-search').val(input_search);
      $('#annonces #input-zipcode').val(zipcodes);

}

Template.annonces.helpers({
    annonces_list: function(){
      if(Session.get('annonces_list') && typeof Session.get('annonces_list') != 'undefined'){
        return Session.get('annonces_list').slice(0, Session.get('annonces_list_max_number'));
      }else{
        return false;
      }
      
    },
    current_lang_fr : function(){
      if(Session.get('lang') == 'fr') return "checked";
      else return '';
    },
    current_lang_nl : function(){
      if(Session.get('lang') == 'nl') return "checked";
      else return '';
    },
    current_lang_frnl : function(){
      if(Session.get('lang') == 'nl') return "checked";
      else return '';
    },
    annonces_list_count_max : function(){
      return Annonces.find().count();
    },
    annonces_list_count: function(){
    	return Session.get('annonces_list_count');
    },
    number_max_annonce_printed : function(){
      if(Session.get('annonces_list_max_number') > Session.get('annonces_list_count')) return Session.get('annonces_list_count');
      else return Session.get('annonces_list_max_number');
    },
    is_favoris_active: function(){
      if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.favoris == 'undefined'
      ){
        return false;
      }
      var favoris = Meteor.user().profile.favoris;
      for (var j = 0; j < favoris.length ; j++) {
         if(this._id == favoris[j]._id){
          return true;
         } 
      }
      return false;
    },
    is_remember_active: function(){
      if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.remembers == 'undefined'
      ){
        return false;
      }
      var remembers = Meteor.user().profile.remembers;

      for (var j = 0; j < remembers.length ; j++) {
         if(this._id == remembers[j].annonce_id){
          return true;
         } 
      }
      return false;
    },
    date_remember : function(){
       if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.remembers == 'undefined'
      ){
        return false;
      }
      var remembers = Meteor.user().profile.remembers;

      for (var j = 0; j < remembers.length ; j++) {
         if(this._id == remembers[j].annonce_id){
         return moment.unix(remembers[j].start).format('LLLL');
         } 
      }
      return translate('add_to_remembers');
    },
    is_phone : function(){
      return Meteor.Device.isPhone();
    },
    price : function(){
      if(this.price && this.price > 0)
        return format_price(this.price);
      else return false;
    },
    is_admin : function(){
        return Roles.userIsInRole(Meteor.userId(), ['admin']);
    },
    old_dates_formated : function(){
      if(typeof this.old_dates != 'undefined' && this.old_dates.length > 3){
        var old_dates_formated = [];
        old_dates_formated[1] = "...";
        for(var i=0;i<this.old_dates.length;i++){
          if(i == 0 ){
            old_dates_formated[0] = this.old_dates[0];
          }else if( i == this.old_dates.length -1 ){
            old_dates_formated[2] = this.old_dates[i];
          }
          
        }
        return old_dates_formated;
      }
      return this.old_dates;
    },
    is_visited : function(){
      if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile.visited_links == 'undefined'
      ){
        return false;
      }
      var visited_links = Meteor.user().profile.visited_links;

      for (var j = 0; j < visited_links.length ; j++) {
         if(this._id == visited_links[j]){
          return true;
         } 
      }
      return false;
    },
    is_note_exist : function(){
      if(
        ! Meteor.user()
        || Meteor.user() == 'null'
        || typeof Meteor.user() == 'undefined'
        || typeof Meteor.user().profile == 'undefined'
        || typeof Meteor.user().profile.notes == 'undefined'
      ){
        return false;
      }

     
      var notes = Meteor.user().profile.notes;

      if(typeof notes[this._id] != 'undefined') return true;
      else return false;
    
    },
    is_more_annonces: function(){
      if(Session.get('annonces_list_count') > Session.get('annonces_list_max_number') ){
        return true;
      }else{
        return false;
      }
    }

});


function format_price(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
}
/*
Meteor.startup(function() {
  Tracker.autorun(function() {

      filter(); 

      setTimeout(function() {
        $('table.footable').trigger('footable_redraw'); 
      }, 300);
  });
});*/

function init(){
  Session.set("page_title","annonces");

  $('#annonces .summernote').summernote({height: 300});
  $('#annonces .footable').footable();

   var config = {
      '.chosen-select' : {
        'width' : '100%'
      }  
  }
  for (var selector in config) {
      $(selector).chosen(config[selector]);
  }
  
  
  setTimeout(function() {
    initValuesAnnonces();
    filter();
  }, 300);    

   switch(BrowserDetect.browser){
      case 'Safari':
      case 'Mozilla':
      case 'Explorer':
        $('#modal_note').on('shown.bs.modal', function (e) {
          $("html, body").animate({ scrollTop: 100 }, "slow");
          $('.modal-backdrop').hide();
        });
        break;
      default:
      
        break;
    }
}


Template.annonces.rendered = function() {
  init();

};

function filter(){
    var province = $('#annonces #province').val();

    if(!Array.isArray(province) && typeof province != 'undefined' && province != null){
      province = [province];
    }

    var date_min = $('#annonces #date-min').val();

     if(typeof date_min == 'undefined') date_min = moment().subtract(1, 'days').format("X");

    var date_max = $('#annonces #date-max').val();
    if(typeof date_max == 'undefined') date_max = moment().format("X");

    var price_min = $('#annonces #price-min').val();
    var price_max = $('#annonces #price-max').val();

    var search = $('#annonces #input-search').val();
    var zipcodes = $('#annonces #input-zipcode').val();

    var lang = $("input[name='lang']:checked").val();

    var sell_location = $("input[name='sell_location']:checked").val();
    
    var requests = {};

    requests = { $and : [] };
    var list_filter = [];  
    var i = 0;

     /* add date search */
    if(typeof date_min == 'undefined' || date_max == 'undefined') return;



    list_filter[i] = {
      "date_timestamp" : {
          $gt: parseFloat(date_min), 
          $lte : parseFloat(date_max)
      }
    };
    
    i++;
    
    /* add keywords search */
    if(search && typeof search != 'undefined'){
        var search_parts = search.split(' ');
        for ( i = 0; i < search_parts.length ; i++) {
          list_filter[(i+1)] = {
            $or: [ 
              { "_id": search_parts[i]}, 
              { "description": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} }, 
              { "location": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "date": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "bedrooms": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "living_space": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "price": {$regex : ".*"+search_parts[i]+".*", $options: 'i'} }, 
              { "title" : {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              { "website" : {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "zip_code" : {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "province" : {$regex : ".*"+search_parts[i]+".*", $options: 'i'} },
              //{ "city" : {$regex : ".*"+search_parts[i]+".*", $options: 'i'} } 
            ]
          };
        }
    }

    if(sell_location){
        i++;
        switch(sell_location){
          case 'location':
            list_filter[i] = {
              $or: [ 
                { "sale" : false },
              ]
            };
            break;
          default:
            list_filter[i] = {
              $or: [ 
                { "sale" : true },
                { "sale" : {$exists : false} }
              ]
            };
            break;
        }
        
    }

    /* add zipcodes search */
    if(zipcodes && typeof zipcodes != 'undefined'){
      i++;
      var zipcodes_in_array = zipcodes.split(' ');
      list_filter[i] = {
        $or: [ 
          { "zip_code" : { $in: zipcodes_in_array } },
        ]
      };
    }

    /* add province search */
    if(province && typeof province != 'undefined'){
        i++;
        filter_provinces = [];
        for (var j = 0; j < province.length ; j++) {
           filter_provinces[j] = { "province": province[j] }
        }
        list_filter[i] = {
          $or: filter_provinces
        };
    }
  
    /* add price search */
    if(typeof price_min != 'undefined' && price_min != ''){
        i++;
        list_filter[i] = {
          "price" : {
              $gte: parseFloat(price_min)
          }
        };
    }

    if(typeof price_max != 'undefined' && price_max != ''){
        if(!list_filter[i] || typeof list_filter[i].price == 'undefined') {
           list_filter[i] = {
              "price" : {
                  $lte: parseFloat(price_max)
              }
            };
        }else{
           list_filter[i].price.$lt = parseFloat(price_max);
        }   
    }


    if(typeof lang != 'undefined' && lang != 'all'){
        i++;
        list_filter[i] = {
          $or: [ 
            { "lang" : lang },
          ]
        };
    }

    //delete null element
    for (var i=0;i<list_filter.length;i++) {
        if (list_filter[i] == null || list_filter[i] == '' || typeof list_filter[i] == 'undefined') {
            list_filter.splice(i, 1);
        }
    }

  
    var results = {};
    if(list_filter.length > 0){
      requests.$and = list_filter;
      results = Annonces.find(requests);
    }else{
      results = Annonces.find();
    }

    Session.set('annonces_list',results.fetch().sort(sort_annonce_date));
    Session.set('annonces_list_count',results.count());


    var filter_infos = {
      province : province,
      date_min : date_min,
      date_max : date_max,
      price_min : price_min,
      price_max : price_max,
      input_search : search,
      zip_code : zipcodes,
      lang : lang,
      sale : sell_location
    }



    $("#annonces .search-button").button('reset');
    $('#annonces .incr-max-number').button('reset'); 

    if(Meteor.user() && Meteor.user() != null && typeof Meteor.user() != 'undefined'){

      var reload_after = false;
      if(typeof Meteor.user().profile != 'undefined'
        && typeof Meteor.user().profile.last_filter != 'undefined' 
      ){


        if(
           Meteor.user().profile.last_filter.province 
          && typeof Meteor.user().profile.last_filter.province != 'undefined' 
        ){
             if(!is_same_array(Meteor.user().profile.last_filter.province,province)){
              reload_after = true;
            }
        }
       
        if(
           Meteor.user().profile.last_filter.zip_code 
          && typeof Meteor.user().profile.last_filter.zip_code != 'undefined' 
        ){
          if(!is_same_array(Meteor.user().profile.last_filter.zip_code,zipcodes)){
            reload_after = true;
          }
        }

      }
      
      Meteor.call('set_last_search', Meteor.user()._id, filter_infos,   function(err, respJson) {
          $('#annonces table.footable').trigger('footable_redraw'); 
          $("#annonces .search-button").button('reset');
          $('#annonces .incr-max-number').button('reset');  
          if(reload_after) {
            //location.reload();
          }

      });

      
    }
   
}

function is_same_array(a1, a2){
  if(!a1 || !a2){
    return false; 
  }
  if (a1.length != a2.length) {
    return false;
  } else {
    for (var a = 0; a < a1.length; ++a) {
      if (a1[a] != a2[a]) {
        return false;
      }
    }
  }
  return true;
}

function sort_annonce_title(a,b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function sort_annonce_date(a,b) {
  if (a.date_timestamp < b.date_timestamp)
    return 1;
  if (a.date_timestamp > b.date_timestamp)
    return -1;
  return 0;
}


Template.annonces.events({
	'click #annonces .search-button' : function(e, t){
  		e.preventDefault();



      $("#annonces .search-button").button('loading');

      setTimeout(function() {
          filter();

      }, 40);    
         

 	},
  'click #annonces .export-pdf':function(e,t){
   // $('#annonces .footable').tableExport({type:'pdf',escape:'false'});
  },
  'click #annonces .export-xls':function(e,t){
    e.preventDefault();

    $('#annonces .footable').tableExport({
      type:'excel'
    });
  
  },
  'click #annonces .export-csv':function(e,t){
    e.preventDefault();

    $('#annonces .footable').tableExport({
      type:'csv'
    });
  
  },
  'click #annonces .export':function(e,t){
    e.preventDefault();

    Session.set('annonces_list_to_export',Session.get('annonces_list'));
    Router.go('/export');
  
  },
  'click #annonces .map-link': function(e,t){
    Session.set('map_target','annonces');
  },
  'click #annonces .link_website': function(e,t){
     // e.preventDefault();
      if(typeof this._id == 'undefined' || this._id == 0){
        var id = $(e.target).data('id');
        if(typeof id == 'undefined'){
           id = $(e.target).closest('a').data('id');
        }
      }else{
        var id = this._id;
      }

      Meteor.call('set_visited_link', Meteor.user()._id, id,   function(err, respJson) {
         
      });
  },

  'click #annonces .favoris': function(e,t){
      e.preventDefault();
      var target = $(e.target);
      var id = $(e.target).data('id');

      if(typeof id == 'undefined' || id == 0 ){
         id = $(e.target).closest('a').data('id');
         target = $(e.target).closest('a');
      }

      //$(target).addClass('active');
      //var button = $('button[data="'+this._id+'"');
      
      if($(target).hasClass('active')){
        $(target).removeClass('active');
        Meteor.call('remove_favoris', Meteor.user()._id, id,  function(err, respJson) {
         
        });
      }else{
        $(target).addClass('active');

        Meteor.call('add_favoris', Meteor.user()._id, id,  function(err, respJson) {
        });
      }
  },
  'click #annonces .remember': function(e,t){
      e.preventDefault();
      var target = $(e.target);
      var id = $(e.target).data('id');

      if(typeof id == 'undefined' || id == 0 ){
         id = $(e.target).closest('a').data('id');
         target = $(e.target).closest('a');
      }

      
      if($(target).hasClass('active')){
        $(target).removeClass('active');
        Meteor.call('remove_remember', Meteor.user()._id, id,  function(err, respJson) {
         
        });
      }else{
        $(target).addClass('active');
        Meteor.call('add_remember', Meteor.user()._id, id,  function(err, respJson) {
        });
      }
  },
  'click #annonces .note': function(e,t){
    e.preventDefault();
    var note = '';
    if(
      typeof Meteor.user() == 'undefined' 
      || typeof Meteor.user().profile.notes == 'undefined'
      || typeof Meteor.user().profile.notes[this._id] == 'undefined'
    ){
      note = '';
    }else{
      note = Meteor.user().profile.notes[this._id];
    }

    $('#modal_note').modal('show');
    
    $('#modal_note .save-note').data('id',this._id);
    $('#modal_note .note-editable').html(note);

    setTimeout(function() {
      $('#modal_note .note-editable').focus();
    }, 300);
    
  },
  'click #annonces .set-see-it' : function(e,t){
    e.preventDefault();
      if(typeof this._id == 'undefined' || this._id == 0){
        var id = $(e.target).data('id');
        if(typeof id == 'undefined'){
           id = $(e.target).closest('a').data('id');
        }
      }else{
        var id = this._id;
      }
      
      Meteor.call('set_visited_link', Meteor.user()._id, id,   function(err, respJson) {
         
      });
     
  },
  "click #annonces .set-dont-see-it" : function(e,t){
      e.preventDefault();
      if(typeof this._id == 'undefined' || this._id == 0){
        var id = $(e.target).data('id');
        if(typeof id == 'undefined'){
           id = $(e.target).closest('a').data('id');
        }
      }else{
        var id = this._id;
      }

       Meteor.call('set_no_visited_link', Meteor.user()._id, id,   function(err, respJson) {
         
      });
  },
  'click #annonces .incr-max-number' : function(e,t){
    e.preventDefault();
    $("#annonces .incr-max-number").button('loading');
    setTimeout(function() {
        Session.set('annonces_list_max_number',Session.get('annonces_list_max_number') + 50);
        filter();
    }, 40);  
  },
  'click #annonces .delete-annonce' : function(e,t){
    e.preventDefault();
    if(typeof this._id == 'undefined' || this._id == 0){
        var id = $(e.target).data('id');
        if(typeof id == 'undefined'){
           id = $(e.target).closest('a').data('id');
        }
      }else{
        var id = this._id;
      }
      if(confirm('Etes-vous sûr de vouloir supprimer cette annonce?')){
         Meteor.call('delete_annonce', id,   function(err, respJson) {
           
        });
      }
     

  },
  'click #annonces .save-note': function(e,t){
    e.preventDefault();
    var annonce_id = $('#modal_note .save-note').data('id');
    var note = $('#modal_note .note-editable').html();

    Meteor.call('add_note', Meteor.user()._id, annonce_id, note,  function(err, respJson) {
      
    });
    $('#modal_note').modal('hide');
  }

});
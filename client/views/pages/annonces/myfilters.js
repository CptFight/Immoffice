

Template.myfilters.rendered = function(){
    Session.set("page_title","alert_mail");
    Tracker.autorun(function() {
        if ( Meteor.user() ) {
            init_filters(); 
        }
    });
}

Template.myfilters.helpers({
    filters: function(){
        return Session.get('filters');        
    }
});

function init_filters(){
    var filters = [
            {
                _id : 0,
                active_first: true,
                province : '',
                price_min : '',
                price_max : '',
                input_search : '',
                zip_code : '',
                date_min : moment().unix(),
                date_max : moment().unix()
            },
            {
                _id : 1,
                active_first : false,
                province : '',
                price_min : '',
                price_max : '',
                input_search : '',
                zip_code : '',
                date_min : moment().unix(),
                date_max : moment().unix()
            }
        ];

        if(
            typeof Meteor.user() == 'undefined' 
            || typeof Meteor.user().profile.filters == 'undefined'
        ){
            Session.set('filters',filters);
        }else{
            for(var i=0; i<Meteor.user().profile.filters.length; i++){
                if(Meteor.user().profile.filters[i]){
                    filters[i] = Meteor.user().profile.filters[i];
                }
            }
            Session.set('filters',filters);
        }
        
}





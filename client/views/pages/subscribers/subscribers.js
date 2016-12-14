

subscribers = new Mongo.Collection('subscribers');
Meteor.subscribe('subscribers');

Template.subscribers.rendered = function(){
    Session.set("page_title","subscribers");
    reset_array_subscribers();
};


Template.subscribers.helpers({
    subscribers_list: function(){
        return Session.get('subscribers_list');
    },
    count_result : function(){
        return Session.get('subscribers_list').length;
    },
    provinces : function(){
        var provinces = [];
        provinces[provinces.length] = "Liège";
        provinces[provinces.length] = "Bruxelles";
        provinces[provinces.length] = "Luxembourg";
        provinces[provinces.length] = "Namur";
        provinces[provinces.length] = "Anvers";
        provinces[provinces.length] = "Limbourg";
        provinces[provinces.length] = "Flandre orientale";
        provinces[provinces.length] = "Brabant flamand";
        provinces[provinces.length] = "Flandre occidentale";
        provinces[provinces.length] = "Brabant wallon";
        provinces[provinces.length] = "Hainaut";
        return provinces;
    },
    create_date : function(){
        return moment(this.createdAt).format('D/M/YYYY');
    },
});


Meteor.startup(function() {
  Tracker.autorun(function() {
    reset_array_subscribers();
  });
});

function reset_array_subscribers(){
    Session.set('subscribers_list',subscribers.find().fetch());
    $('#subscribers .footable').footable();
}

Template.subscribers.events({
    "click #subscribers .search-suscribers" : function(e,t){
        e.preventDefault();
        reset_array_subscribers();
    },
    "click #subscribers .add-subscriber" : function(e,t){
        e.preventDefault();
        var email = $("#add-subscriber-input").val();
        var province = $("#select-province-input").val();
        if(email != ''){
            Meteor.call('add_subscriber', email, province,   function(err, respJson) {
               reset_array_subscribers();
               $("#add-subscriber-input").val('');
            });
        }else{
            Meteor.call('send_to_subscribes',  function(err, respJson) {
                if (err){
                    toastr["warning"](err.message, "Send sucribers");
                }else{
                    toastr["success"]("Mails envoyé", "Send sucribers");
                }
            });
        }
       
    },
    "click #subscribers .delete-suscriber" : function(e,t){
        e.preventDefault();
        var id = $(e.target).data('id');
        Meteor.call('delete_subscriber', id,   function(err, respJson) {
           reset_array_subscribers();
        });
    }
});


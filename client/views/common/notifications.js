notifications = new Meteor.Stream('server-notifications');

//create a client only collection
notificationCollection = new Meteor.Collection(null);

//listen to the stream and add to the collection
notifications.on('message', function(message, link, time) {
    notificationCollection.insert({
      message: message,
      link: link,
      time: time
    });
});


//render template with the collection
Template.topNavbar.helpers({
    'messages': function() {
      return notificationCollection.find();
    },
    'count_messages': function() {
      return notificationCollection.find().count();
    },
    'dateString': function() {
        var date = new Date(this.time);
        return date.toLocaleTimeString()+" "+date.toLocaleDateString();
    },

});

//simple clear message action
Template.topNavbar.events({
    'click #clear-messages': function() {
        notificationCollection.remove({});
    }
});



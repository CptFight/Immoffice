 notifications = new Meteor.Stream('server-notifications');


 //allow any connected client to listen on the stream
  notifications.permissions.read(function(userId, eventName) {
    return true;
  });

  //notify clients with a message per every second
  /*setInterval(function() {
    notifications.emit('message', 'Server Generated Message', Date.now());
  }, 1000);*/
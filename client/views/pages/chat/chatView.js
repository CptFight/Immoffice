
Meteor.subscribe('users');

chatStream = new Meteor.Stream('chat');
chatCollection = new Meteor.Collection(null);

chatStream.on('chat', function(message, username) {
  var user_receive_infos = Meteor.users.findOne({_id:this.userId});
  var default_picture = "";
 
  if(user_receive_infos && typeof user_receive_infos.profile.default_picture != 'undefined'){    
    default_picture = user_receive_infos.profile.default_picture;
  }

  chatCollection.insert({
    username: username,
    userId: this.userId,
    message: message,
    picture: Meteor.settings.public.cdn.get_path+default_picture,
    date : new Date()
  });
});

Template.chatView.rendered = function(){
  Session.set("page_title","chat");
};

Template.chatView.helpers({
  "messages": function() {
    return chatCollection.find();
  },
  "isOwner" : function(){
    return this.userId === Meteor.userId();
  },
  "path_cdn": function(){
    return Meteor.settings.public.cdn.get_path;
  },
  "list_users" : function(){
    return Meteor.users.find().fetch();
  }
});


var subscribedUsers = {};


Template.chatView.helpers({
  "user": function() {
    return (this.username)? this.username: this.subscriptionId;
  },
  "picture_user" : function(){
    return (this.picture)? this.picture: "img/a4.jpg";
  },
  "date": function(){
      return this.date.toLocaleDateString();
  }
});

Template.chatView.events({
  "click .send_chat": function(e) {
    e.preventDefault();
    e.stopPropagation();

    var message = '';
    $('.chat-message').each(function(){
      if($(this).val() != '' && typeof $(this).val() != 'undefined'){
         message = $(this).val();
      }
     }); 
    chatCollection.insert({
      userId: Meteor.userId(),
      username: Meteor.user().username,
      picture: Meteor.settings.public.cdn.get_path+Meteor.user().profile.default_picture,
      message: message,
      date : new Date()
    });
    chatStream.emit('chat', message);
     $('.chat-message').val('');
  }
});
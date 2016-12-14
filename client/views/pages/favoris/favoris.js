


Template.favoris.helpers({
    childrens_repository : function(){
        var repositories = [];
        if(typeof this.children != 'undefined'){
          for(var i=0;i<this.children.length;i++){
            if(this.children[i].type == 'repository'){
              repositories.push(this.children[i]);
            }
          }
        }
        return repositories;
      
    },
    childrens_favoris : function(){
        var favoris = [];
        if(typeof this.children != 'undefined'){
          for(var i=0;i<this.children.length;i++){
            if(this.children[i].type == 'annonce'){
              if( Meteor.user() && typeof  Meteor.user().profile != 'undefinded'){
                var favoris_user = Meteor.user().profile.favoris;
                for(var y=0;y<favoris_user.length;y++){
                  if(favoris_user[y]._id == this.children[i].id){
                    var favori = favoris_user[y];
                    favori.id = this.children[i].id;
                    favori.children = this.children[i].children;
                    favoris.push(favori);
                  }
                }
              }
              
              
            }
          }
        }
        
        return favoris;
      
    }
});
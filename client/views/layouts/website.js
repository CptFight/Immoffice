Template.website.rendered = function(){

    // Add special class for handel top navigation layout
    $('body').addClass('top-navigation');

}

Template.website.destroyed = function(){

    // Remove special top navigation class
    $('body').removeClass('top-navigation');
};
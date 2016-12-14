

Template.calendar.helpers({
    new_events: function(){
        
        return Session.get('remember_list');
    }
});

function initRemember(){
    var list_remembers = [];

    if(
        typeof Meteor.user() == 'undefined' 
        || typeof Meteor.user().profile.remembers == 'undefined'
    ){
        return false;
    }
    var remembers = Meteor.user().profile.remembers;
    var favoris = Meteor.user().profile.favoris;

    for(var i= 0; i < remembers.length; i++){
        if(typeof remembers[i].start == 'undefined' || remembers[i].start == ''){
            var annonce = Annonces.findOne(remembers[i].annonce_id);
            if(typeof Meteor.user().profile.favoris != 'undefined' ){
                
                var elementPos = Meteor.user().profile.favoris.map(function(x) {
                    if(typeof x._id != 'undefined')
                        return x._id; 
                    else return false;
                }).indexOf(remembers[i].annonce_id);
                if(elementPos != -1){
                    annonce = Meteor.user().profile.favoris[elementPos];
                    /*if(typeof annonce == 'undefined') annonce = Meteor.user().profile.favoris[elementPos];
                   
                    if(typeof favoris[j].name_proprio != 'undefined'){
                        annonce.name_proprio = favoris[j].name_proprio;
                    }
                    if(typeof favoris[j].adress != 'undefined'){
                        annonce.adress = favoris[j].adress;
                    }
                    if(typeof favoris[j].tel != 'undefined'){
                        annonce.tel = favoris[j].tel;
                    }*/
                   
                }

            }

            var note = '';
            if(typeof annonce != 'undefined' && typeof annonce._id != 'undefined' && typeof Meteor.user().profile.notes[annonce._id] != 'undefined'){
                note = Meteor.user().profile.notes[annonce._id];
            }
           
 
           

            if(typeof annonce != 'undefined' && annonce){

               annonce.note = note;
               var favorisrepositories = Meteor.user().profile.favorisrepository;
               annonce.color = findColorAnnonce(annonce._id,favorisrepositories,false);
               list_remembers.push(annonce);
            }  
        }
       
    }
    Session.set('remember_list',list_remembers);
}

function findColorAnnonce(annonceid,favorisrepositories,color){
    if(typeof favorisrepositories != 'undefined' && favorisrepositories){
        for(var j= 0; j<favorisrepositories.length; j++){
            if(favorisrepositories[j].id == annonceid){
                if(favorisrepositories){
                    return color;
                }else{
                    return false;
                }
            }

            if(typeof favorisrepositories[j].children != 'undefined' && favorisrepositories[j].children.length > 0){
                var color = false;
                if(typeof favorisrepositories[j].color != 'undefined'){
                    color = favorisrepositories[j].color;
                }
                var return_value = findColorAnnonce(annonceid,favorisrepositories[j].children,color);
                if(return_value) return return_value;
            }
        }
        
    }

    return false;
}


Template.calendar.events({
 'click #modal_calendar .save-event': function(e,t){

    e.preventDefault();
    var annonce_id = $('#modal_calendar .save-event').data('annonce_id');
    var title = $('#modal_calendar #event-title').val();
    var clock = $('#modal_calendar #event-clock').val();
    var event = $('#modal_calendar').data('event');
    var note = $('#modal_calendar #note').val();
    var tel = $('#modal_calendar #event-tel').val();

    var adress = $('#modal_calendar #event-adress').val();
    var name_proprio = $('#modal_calendar #event-name-proprio').val();

    var clock_parts = clock.split(':');


    var date = $('#modal_calendar').data('date');

    var stringyDate =  $('#modal_calendar #event-date').val();
    var stringyDate_parts = stringyDate.split('/');
    var date_input = new Date(stringyDate_parts[1]+"/"+stringyDate_parts[0]+"/"+stringyDate_parts[2]);
    
    var color = $('#modal_calendar .save-event').data('color');
    var hour = clock_parts[0];
    //if(event == 'drop') hour = hour - 2;

    date_input.setHours(hour);
    date_input.setMinutes(clock_parts[1]);

    //date.hour(hour).minute(clock_parts[1]);

    var ms = date_input.valueOf();
    var timestamp = ms / 1000;

    var path = $('#modal_calendar .save-event').data('path');
   
    Meteor.call('set_infos_event', Meteor.user()._id, annonce_id,color, title,tel,adress,name_proprio,note, timestamp ,path, function(err, respJson) {
        try{
            var events = Meteor.user().profile.remembers;
            var favorisrepositories = Meteor.user().profile.favorisrepository;
            events.forEach(function(event) {
                event.start = new Date(event.start *1000);
                event.color = findColorAnnonce(event.annonce_id,favorisrepositories,false);
            });
            Session.set('events',events);
        }catch(e){
           //console.log('events',events);
        }
    });
    $('#modal_calendar').modal('hide');
  },
  "click #modal_calendar .delete-event":function(e,t){
    e.preventDefault();
    var annonce_id = $('#modal_calendar .save-event').data('annonce_id');
    Meteor.call('remove_remember', Meteor.user()._id, annonce_id, function(err, respJson) {
        try{
            var events = Meteor.user().profile.remembers;
            var favorisrepositories = Meteor.user().profile.favorisrepository;
            events.forEach(function(event) {
                event.start = new Date(event.start *1000);
                event.color = findColorAnnonce(event.annonce_id,favorisrepositories,false);
            });
            Session.set('events',events);
        }catch(e){
           //console.log('events',events);
        }
    });
    $('#modal_calendar').modal('hide');
  }
});

function init(){
     $('#modal_calendar .clockpicker').clockpicker();
    $('#modal_calendar #event-date').datepicker({
        format: "dd/mm/yyyy"
    });

   // $.fn.datepicker.defaults.format = "mm/dd/yyyy";

    Tracker.autorun(function() {
        try{
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', Session.get('events'));         
            $('#calendar').fullCalendar('rerenderEvents' );
        }catch(e){

        }
     });

    // Initialize i-check plugin
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    // Initialize the external events
    $('#external-events div.external-event').each(function() {
        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 1111999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag*/
        });

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

    });

    var events = [];
    if(
        Meteor.user() 
        && typeof Meteor.user().profile.remembers != 'undefined'
    ){
        var events = Meteor.user().profile.remembers;
        var favorisrepositories = Meteor.user().profile.favorisrepository;
        events.forEach(function(event) {
            event.start = new Date(event.start *1000);
            event.color = findColorAnnonce(event.annonce_id,favorisrepositories,false);
        });
    }
    Session.set('events',events);

    $('#calendar').fullCalendar({

        eventDrop: function(event, delta, revertFunc, jsEvent, ui, view ){
            try{
                jsEvent.preventDefault();
                
                $('#modal_calendar').modal('show');
                $('#modal_calendar').data('date',event.start);;
                $('#modal_calendar').data('event','drop');
                /*$('#modal_calendar .clockpicker').clockpicker();
                $('#modal_calendar #event-date').datepicker();*/
                $('#modal_calendar #event-date').val(event.start.format('D/M/YYYY'));


                //console.log('event',event);
                $('#modal_calendar .save-event').data('annonce_id',event.annonce_id);
                $('#modal_calendar .save-event').data('path',event.path);
                $('#modal_calendar .save-event').data('color',event.color);

                $('#modal_calendar .modal-title').html("Modifier mon évenement");
                if(event.path == '#' || event.path == ''){
                    $('#modal_calendar #annonce-link').hide();
                }else{
                    $('#modal_calendar #annonce-link').show();
                }
                $('#modal_calendar #annonce-link').attr('href',event.path);
                $('#modal_calendar #note').val(event.note);

                if(typeof event.tel != 'undefined'){
                    $('#modal_calendar #event-tel').val(event.tel);
                }

                if(typeof event.adress != 'undefined'){
                    $('#modal_calendar #event-adress').val(event.adress);
                }
                if(typeof event.name_proprio != 'undefined'){
                    $('#modal_calendar #event-name-proprio').val(event.name_proprio);
                }


                $('#modal_calendar #event-title').val(event.title);
                $('#modal_calendar #event-clock').val(event.start.format('HH:mm'));
            }catch(e){

            }
        },
        eventClick: function(event) {
            try{
                $('#modal_calendar').modal('show');
                $('#modal_calendar').data('date',event.start);
                $('#modal_calendar').data('event','click');
                /*$('#modal_calendar .clockpicker').clockpicker();
                $('#modal_calendar #event-date').datepicker();*/
                $('#modal_calendar #event-date').val(event.start.format('D/M/YYYY'));

                //console.log('event',event);
                $('#modal_calendar .save-event').data('annonce_id',event.annonce_id);
                $('#modal_calendar .save-event').data('path',event.path);
                $('#modal_calendar .save-event').data('color',event.color);

                $('#modal_calendar .modal-title').html("Modifier mon évenement");
                 if(event.path == '#' || event.path == ''){
                    $('#modal_calendar #annonce-link').hide();
                }else{
                    $('#modal_calendar #annonce-link').show();
                }
                $('#modal_calendar #annonce-link').attr('href',event.path);
                $('#modal_calendar #note').val(event.note);
                if(typeof event.tel != 'undefined'){
                    $('#modal_calendar #event-tel').val(event.tel);
                }
                if(typeof event.adress != 'undefined'){
                    $('#modal_calendar #event-adress').val(event.adress);
                }
                if(typeof event.name_proprio != 'undefined'){
                    $('#modal_calendar #event-name-proprio').val(event.name_proprio);
                }
                
                $('#modal_calendar #event-title').val(event.title);
                $('#modal_calendar #event-clock').val(event.start.format('HH:mm'));//event.start.format('LT'));
            }catch(e){

            }
        },
        header: {
            left: "prev,next today",
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        monthNames:[translate('month_1'), translate('month_2'), translate('month_3'), translate('month_4'), translate('month_5'), translate('month_6'), translate('month_7'), translate('month_8'), translate('month_9'), translate('month_10'), translate('month_11'), translate('month_12')],
        monthNamesShort:[translate('month_1_small'), translate('month_2_small'), translate('month_3_small'), translate('month_4_small'), translate('month_5_small'), translate('month_6_small'), translate('month_7_small'), translate('month_8_small'), translate('month_9_small'), translate('month_10_small'), translate('month_11_small'), translate('month_12_small')],
        dayNames: [translate('week_7'),translate('week_1'), translate('week_2'), translate('week_3'), translate('week_4'), translate('week_5'), translate('week_6')],
        dayNamesShort: [translate('week_7_small'),translate('week_1_small'), translate('week_2_small'), translate('week_3_small'), translate('week_4_small'), translate('week_5_small'), translate('week_6_small')],
       /* titleFormat: {
            month: 'MMMM YYYY',
            week: "d[ MMMM][ yyyy]{ - d MMMM yyyy}",
            day: 'dddd d MMMM yyyy'
        },*/
        columnFormat: {
            month: 'ddd',
            week: 'ddd d',
            day: ''
        },
        axisFormat: 'H:mm', 
        /*timeFormat: {
            '': 'HH:MM', 
            agenda: 'HH:MM - HH:MM'
        },*/
        timeFormat:'HH:mm',
        firstDay:1,
        buttonText: {
            today: translate('today'),
            day: translate('day'),
            week: translate('week'),
            month: translate('month')
        }, 
        editable: true,
        //ignoreTimezone : true,
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function(date, jsEvent, ui, resourceId) {
            try{
               
                $('#modal_calendar').modal('show');
                $('#modal_calendar').data('date',date);
                $('#modal_calendar').data('event','drop');
                
                $('#modal_calendar #event-date').val(date.format('D/M/YYYY'));

                if($(jsEvent.target).data('path') == '#' || $(jsEvent.target).data('path') == ''){
                    $('#modal_calendar #annonce-link').hide();
                }else{
                    $('#modal_calendar #annonce-link').show();
                }
                $('#modal_calendar #annonce-link').attr('href',$(jsEvent.target).data('path'));
                

                $('#modal_calendar .save-event').data('annonce_id',$(jsEvent.target).data('id'));
                $('#modal_calendar .save-event').data('path',$(jsEvent.target).data('path'));
                $('#modal_calendar .save-event').data('color',$(jsEvent.target).data('color'));


                $('#modal_calendar .modal-title').html("Modifier mon évenement");
                $('#modal_calendar #event-title').val($(jsEvent.target).data('title'));
                $('#modal_calendar #event-clock').val(date.format('HH:mm'));

                $('#modal_calendar #event-tel').val($(jsEvent.target).data('tel'));
                $('#modal_calendar #event-adress').val($(jsEvent.target).data('adress'));
                $('#modal_calendar #event-name-proprio').val($(jsEvent.target).data('owner'));
                
                $('#modal_calendar #note').val($(jsEvent.target).data('note') );
               
                $(jsEvent.target).remove();
            }catch(e){
                //console.log('ERROR ',e.message);
            }
        },
        events:   Session.get('events')
    });
}


Template.calendar.rendered = function(){
    Session.set("page_title","calendar");
    initRemember();
   
    setTimeout(function() {
      init();
    }, 300);

};
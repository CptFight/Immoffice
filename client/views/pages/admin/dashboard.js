
Template.dashboard.helpers({
    number_client_connected : function(){
        return Meteor.users.find({ "status.online": true }).count();
    },
    number_client : function(){
        //var service_payed = ['standart','pack','full-pack'];
        //return Meteor.users.find({"profile.contract_amount" : { $gt : 0 }}).count();

        var users = Meteor.users.find({}).fetch();
        var number_client = 0;
        for(var i=0; i<users.length; i++){
            if(typeof users[i].profile.contract_amount != 'undefined'
                && parseFloat(users[i].profile.contract_amount) > 0
            ){
                number_client ++;
            }
        }
        return number_client;


    },
    number_annonce : function(){
        return Annonces.find().count();
    },
    income : function(){
       /* var clients_standart =  Meteor.users.find({ "profile.service" : "standart"}).count();
        var clients_pack =  Meteor.users.find({ "profile.service" : "pack"}).count();
        var clients_full_pack =  Meteor.users.find({ "profile.service" : "full-pack"}).count();
        var income = (clients_standart * 79) + (clients_pack * 119) + (clients_full_pack * 149);
        return income;*/
        var users = Meteor.users.find({}).fetch();
        var income = 0;
        for(var i=0; i<users.length; i++){
            if(typeof users[i].profile.contract_amount != 'undefined'){
                income += parseFloat(users[i].profile.contract_amount);
            }
        }
        return income;
    }
});


function gd(timeStamp) {
    return new Date(timeStamp*1000).getTime();
}

function sortByDate(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'date': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { 
        return a.date - b.date; 
       // return a.key - b.key; 
    });
    return arr; // returns array
}

function setChartValues(){
    var clients = [];
    var clients_list = {};
      
    var clients_tmp = Meteor.users.find().fetch();

    for(var i=0; i<clients_tmp.length; i++){
        var client = clients_tmp[i];

        if(typeof client != 'undefined'){
            var date = gd(moment(client.createdAt).subtract(1, 'month').format("X"));

            if(typeof clients_list[date] == 'undefined') clients_list[date] = 1;
            else clients_list[date] = clients_list[date] +1 ; 
            
        }
    }

   
    clients_list = sortByDate(clients_list);
    
   

    var cpt = 0;
    $.each(clients_list, function(key, infos) {
        cpt += infos.value;
        clients[clients.length] = [parseFloat(infos.date),cpt];
    });


    var dataset = [
        {
            label: translate('users'),
            data: clients,
            color: "#f8ac59",
            lines: {
                lineWidth:1,
                show: true,
                fill: false,
                fillColor: {
                    colors: [{
                        opacity: 1
                    }, {
                        opacity: 1
                    }]
                }
            }

        }
    ];


    var options = {
        xaxis: {
            mode: "time",
            tickSize: [3, "day"],
            tickLength: 0,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 10,
            color: "#d5d5d5"
        },
        yaxes: [{
            position: "left",
           // max: 1070,
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 3
        }, {
            position: "right",
            clolor: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: ' Arial',
            axisLabelPadding: 67
        }
        ],
        legend: {
            noColumns: 1,
            labelBoxBorderColor: "#000000",
            position: "nw"
        },
        grid: {
            hoverable: false,
            borderWidth: 0
        }
    };

   

    $.plot($("#flot-dashboard-chart"), dataset, options);
}


Template.dashboard.rendered = function(){
    Session.set("page_title","dashboard");
    // Set white background color for top navbar
    $('body').addClass('light-navbar');

    setChartValues();   
};

Template.dashboard.destroyed = function(){
    // Remove special class
    $('body').removeClass('light-navbar');
};
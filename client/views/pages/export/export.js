Template.export.rendered = function(){
     Session.set("page_title","export");
    // Initialize dataTables
    $('.dataTables-example').dataTable({
        //"dom": 'lTfigt',
        //"dom":"lTfrtipg",
        "dom":"lTfrtipg",
        "pageLength": 50,
        "tableTools": {
            "sSwfPath": "swf/copy_csv_xls_pdf.swf"
        },
        "language": {
            "url": translate('cdn_datatable_lang_url')//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json",
           
        }
    });

};


Template.export.helpers({
    annonces_list: function(){
      if(Session.get('annonces_list_to_export') && typeof Session.get('annonces_list_to_export') != 'undefined'){
        return Session.get('annonces_list_to_export');
      }else{
        return false;
      }
      
    },
    adress : function(){
        if(typeof this.adress == 'undefined' || this.adress == ''){
            return this.location;
        }else{
            return this.adress;
        }
    }
});
var name=null;

var model={
  salon: ko.observable(''),
};

function saveDraft(callback)
{
    var subject=$('#subjectField').val();
    $('#subjectField').val('');
    var body=$('#bodyField').val();
    $('#bodyField').val('');
    
    post.addDraft(name, subject, body, null, callback);
}

$(document).ready(function() {
  name=$.query.get('salon');
  log('salon: '+salon); 
  $('#threadsMenu a').attr('href', '/salon?salon='+name); 
  
  ko.applyBindings(model);    

  salon.getDisplayName(name, function(displayName) {
    model.salon(displayName);
  });  
  
  $('#previewButton').click(function () {
    log('clicked preview');
    saveDraft(function(msgid) {
      log('msgid: '+msgid);
      window.location='/preview?msgid='+msgid;
    });
  });
  
  $('#draftButton').click(function () {
    log('clicked save');
    saveDraft();
    $('#savedToast').attr('opened', true);
  });
});

var name=null;
var msgid=null;

var model={
  salon: ko.observable(''),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function validate(subject, body)
{
  if(subject==null || subject=='' || body==null || body=='')
  {
    $('#dialog').attr('opened', true);
    return false;
  }
  else
  {
    return true;
  }
}

function saveDraft(postit, callback)
{
    var subject=$('#subjectField').val();
    var body=$('#bodyField::shadow textarea').val();
    
    log('subject: '+subject);
    log('body: '+body);

    if(!validate(subject, body))
    {
      return;
    }
    
    draft.save(msgid, subject, body, postit);
    
    if(callback)
    {
      callback();
    }
}

$(document).ready(function() {
  msgid=$.query.get('msgid');
  
  ko.applyBindings(model);    
  
  login(model);

  $(window).bind('polymer-ready', function()
  {
    draft.get(msgid, function(result) {
      log('got draft');
      log(result);
      name=result.salon;
      $('#subjectField').val(result.subject);
      $('#bodyField::shadow textarea').val(result.body);
    
      salon.getDisplayName(result.salon, function(displayName) {
        model.salon(displayName);
      });          
    });
  });
    
  $('#draftButton').click(function () {
    log('clicked save');
    saveDraft(false, function() {
      $('#savedToast').attr('opened', true);      
    });
  });
  
  $('#postButton').click(function() {
    log('clicked post');
    saveDraft(true, function() {
      window.location='/salon?salon='+name;      
    });
  })
  
  $('#deleteButton').click(function() {
    log('clicked delete');
    draft.remove(msgid, function() {      
      window.location='/drafts';      
    });
  })
});

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

function addDraft(postit, callback)
{
    var subject=$('#subjectField').val();
    var body=$('#bodyField::shadow textarea').val();
    
    if(!validate(subject, body))
    {
      return;
    }

    log('subject: '+subject);
    log('body: '+body);
    
    draft.add(name, subject, body, null, !postit, callback);
}

function saveDraft(postit, callback)
{
    var subject=$('#subjectField').val();
    var body=$('#bodyField::shadow textarea').val();
    
    if(!validate(subject, body))
    {
      return;
    }
    
    log('subject: '+subject);
    log('body: '+body);
    
    draft.save(msgid, subject, body, postit);    
    
    if(callback)
    {
      callback();
    }
}

$(document).ready(function() {
  name=$.query.get('salon');
  log('salon: '+salon); 
  $('#threadsMenu a').attr('href', '/salon?salon='+name); 
  
  ko.applyBindings(model);    
  
  login(model);

  salon.getDisplayName(name, function(displayName) {
    model.salon(displayName);
  });  
    
  $('#draftButton').click(function () {
    log('clicked save');
    if(msgid==null)
    {
      addDraft(false, function(result) {
        msgid=result;
        $('#savedToast').attr('opened', true);
      });
    }
    else
    {
      saveDraft(false, function() {
        $('#savedToast').attr('opened', true);
      });
    }
  });
  
  $('#postButton').click(function() {
    log('clicked post');
      
    if(msgid==null)
    {
      addDraft(true, function(result) {
        window.location='/salon?salon='+name
      });
    }
    else
    {
      saveDraft(true);
      window.location='/salon?salon='+name
    }
  })
});

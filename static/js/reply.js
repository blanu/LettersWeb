var name=null;
var parent=null;
var msgid=null;

var model={
  salon: ko.observable(''),
  subject: ko.observable(''),
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
    
    draft.add(name, subject, body, parent, !postit, callback);
}

function saveDraft(postit)
{
    var subject=$('#subjectField').val();
    var body=$('#bodyField::shadow textarea').val();
    
    if(!validate(subject, body))
    {
      return;
    }    
    
    draft.save(msgid, subject, body, postit);
}

$(document).ready(function() {
  replyto=$.query.get('replyto');
  log('replyto: '+replyto); 

  ko.applyBindings(model);
  
  login(model);
  
  post.get(replyto, function(result) {
    log(result);
    name=result.salon;
    parent=result.msgid;
    model.subject(result.subject);
    $('#parentPost').append('<mark-down>'+result.body+'</mark-down>');
  
    $('#threadsMenu a').attr('href', '/salon?salon='+name); 
    
    salon.getDisplayName(name, function(displayName) {
      model.salon(displayName);
    });    
  });
  
  $('#previewButton').click(function () {
    log('clicked preview');
    saveDraft(function(result) {
      log('msgid: '+msgid);
      window.location='/preview?salon='+name+'&msgid='+result;
    });
  });
  
  $('#draftButton').click(function () {
    log('clicked save');
    if(msgid==null)
    {
      addDraft(false, function(result) {
        msgid=result;
        log(msgid);
      });
    }
    else
    {
      saveDraft(false);
    }
    $('#savedToast').attr('opened', true);
  });
  
  $('#postButton').click(function() {
    log('clicked post');
    if(msgid==null)
    {
      addDraft(true, function(result) {
        window.location='/viewThread?msgid='+parent;
      });
    }
    else
    {
      saveDraft(true);
      window.location='/viewThread?msgid='+parent;
    }
  })
});

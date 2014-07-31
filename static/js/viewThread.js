var msgid=null;

var model={
  salon: ko.observable(''),
  author: ko.observable(''),
  children: ko.observableArray([]),
  admin: ko.observable(false),
  logout: ko.observable('')
};

$(document).ready(function() {
  msgid=$.query.get('msgid');
  log('salon: '+salon); 
  
  ko.applyBindings(model);    

  login(model);

  $(window).bind('polymer-ready', function()
  {
    post.get(msgid, function(result) {
      log('got draft');
      log(result);
      name=result.salon;
      model.author(result.author);
      $('#subjectField').append(result.subject);
//      $('#bodyField::shadow div').val(result.body);    
//      $('#bodyField').val(result.body);
      $('#body').append('<mark-down>'+result.body+'</mark-down>');
      
      for(var index in result.children)
      {
        var child=result.children[index];
        model.children.push(child);
      }
      
      $('.child').each(function () {
        var childid=$(this).attr('msgid');
        $(this).attr('href', '/viewThread?msgid='+childid);
      });
    
      salon.getDisplayName(result.salon, function(displayName) {
        model.salon(displayName);
        $('#threadsMenu a').attr('href', '/salon?salon='+result.salon); 
      });          
      
      $('#replyButton').click(function() {
        log('clicked reply');
        window.location='/reply?replyto='+msgid;
      })
    });
  });
});

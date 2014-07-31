var model={
  salon: ko.observable(''),
  threads: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function fixLinks()
{
  $('.thread a').each(function() {
    var msgid=$(this).attr('id');
    $(this).attr('href', '/viewThread?msgid='+msgid);
  });
}

$(document).ready(function() {
  var name=$.query.get('salon');
  log('salon: '+salon);
  $('#newThreadMenu a').attr('href', '/newThread?salon='+name);
  $('#start').attr('href', '/newThread?salon='+name);
  
  ko.applyBindings(model);    
  
  login(model);

  salon.getDisplayName(name, function(displayName) {
    model.salon(displayName);
  });
  
  salon.getThreads(name, function(threads) {
    log('threads: '+threads);
    
    model.empty(threads.length==0);
    
    for(var index in threads)
    {
      model.threads.push(threads[index]);
    }
    
    fixLinks();
  });    
});

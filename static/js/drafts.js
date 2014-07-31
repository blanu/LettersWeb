var model={
  drafts: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

$(document).ready(function() {
  ko.applyBindings(model);    
  
  login(model);
  
  draft.list(function(results) {
    log('drafts: '+results);
    
    model.empty(results.length==0);
    
    for(var index in results)
    {
      var post=results[index];
      log('post');
      log(post);
      model.drafts.push(post);
//      $('#'+post.msgid).text(post.salon+' : '+post.subject);
      $('#'+post.msgid).attr('href', '/editDraft?msgid='+post.msgid);
    }
  });    
});
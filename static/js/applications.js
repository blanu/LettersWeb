var model={
  applications: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

$(document).ready(function() {
  ko.applyBindings(model);
  
  login(model);

  application.list(function(results) {
    model.empty(results.length==0);
    
    for(var index in results)
    {
      var result=results[index];
      model.applications.push(result);
    }
    
    $('.application a').each(function() {
      var appid=$(this).attr('id');
      $(this).attr('href', '/admin/reviewApplication?appid='+appid);
    });
  });
});
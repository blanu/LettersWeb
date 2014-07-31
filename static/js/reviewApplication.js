var appid=null;

var model={
  user: ko.observable(''),
  essay: ko.observable(''),
  username: ko.observable(''),
  admin: ko.observable(false),
  logout: ko.observable('')
};

$(document).ready(function() {
  ko.applyBindings(model);
  
  appid=$.query.get('appid');
  
  login(model);

  application.get(appid, function(result) {
    model.user(result.user);
    model.essay(result.essay);
    model.username(result.username);
  });
  
  $('#approveButton').click(function() {
    log('clicked approve');
    application.approve(appid);
    window.location='/admin/applications';
  });
  
  $('#rejectButton').click(function() {
    log('clicked reject');
    application.reject(appid);
    window.location='/admin/applications';
  });  
});
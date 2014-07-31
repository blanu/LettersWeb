var model={
  admin: ko.observable(false),
  applied: ko.observable(false)
};

$(document).ready(function() {
  ko.applyBindings(model);    
  
  user.isLoggedIn(function(result) {
    log('isLogginedIn '+result);
    if(result)
    {
      user.isAdmin(function(result) {
        log('isAdmin: '+result);
        model.admin(true);
      });
      
      user.isMember(function(isMember) {
        if(isMember)
        {
          window.location='/salons';
        }
        else
        {
          user.hasApplied(function(hasApplied) {
            model.applied(hasApplied);
          });
        }
      });
    }
    else
    {
      window.location='/';
    }
  });
      
  $('#applyButton').click(function () {
    log('clicked apply');
    var username=$('#usernameField').val();
    var body=$('#bodyField::shadow textarea').val();
    user.apply(username, body);
    model.applied(true);
  });
});

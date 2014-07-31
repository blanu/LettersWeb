var model={
  login: ko.observable('')
};

$(document).ready(function() {
  ko.applyBindings(model);

  user.isLoggedIn(function(result) {
    if(result)
    {
      window.location='/salons';
    }
    else
    {
      user.login(function(result) {
        model.login(result);
      });
    }
  });   
});

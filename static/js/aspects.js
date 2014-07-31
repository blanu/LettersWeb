var model={
  aspects: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function fixLinks()
{
  $('.aspect a').each(function() {
    var appid=$(this).attr('id');
    $(this).attr('href', '/admin/editAspect?key='+appid);
  });
}

function addAspect()
{
  log('add aspect');
  var name=$('#nameField').val();
  $('#nameField').val('');
  aspect.add(name, function(result) {
    model.aspects.push(result);
    fixLinks();
  });
}

$(document).ready(function() {
  ko.applyBindings(model);
  
  login(model);

  $('#addButton').click(addAspect);

  aspect.list(function(results) {
    model.empty(results.length==0);
    
    for(var index in results)
    {
      var result=results[index];
      model.aspects.push(result);
    }    
    
    fixLinks();
  });
});
var salons=null;
var model={
  admin: ko.observable(false),
  salons: ko.observableArray([]),
  empty: ko.observable(true),
  logout: ko.observable('')
};

function addSalon()
{
  log('add salon');
  var name=$('#nameField').val();
  var displayName=$('#displayNameField').val();
  salon.add(name, displayName);
  $('#nameField').val('');
  $('#displayNameField').val('');
  salons.push({'name': name, 'displayName': displayName});
  
  fixUrls();
  
  return false;
}

function fixUrls()
{
  $('.salons li a').each(function() {
    var name=$(this).attr('name');
    var url='/salon?salon='+name;
    $(this).attr('href', url);
  });
}

function menuSelect(e, detail)
{
  log('menu select');
}

$(document).ready(function() {  
  ko.applyBindings(model);
   
  login(model);   
     
  salon.list(function(result) {
    log(result);
    
    model.empty(result.length==0);
    
    for(var index in result)
    {
      var salon=result[index];
      model.salons.push(salon);
    }
    
    fixUrls();
  });
});

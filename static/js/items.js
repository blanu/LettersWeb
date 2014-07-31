var model={
  items: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function fixLinks()
{
  $('.item a').each(function() {
    var appid=$(this).attr('id');
    $(this).attr('href', '/admin/editItem?key='+appid);
  });
}

function addItem()
{
  log('add item');
  
  var name=$('#nameField').val();
  $('#nameField').val('');
  
  var image=$('#imageField').val();
  $('#imageField').val('');
  
  item.add(name, image, function(result) {
    model.items.push(result);
    fixLinks();
  });
}

$(document).ready(function() {
  ko.applyBindings(model);
  
  login(model);

  $('#addButton').click(addItem);

  item.list(function(results) {
    model.empty(results.length==0);
    
    for(var index in results)
    {
      var result=results[index];
      model.items.push(result);
    }    
    
    fixLinks();
  });
});
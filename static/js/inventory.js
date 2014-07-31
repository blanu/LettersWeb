var model={
  items: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function fixLinks()
{
  $('.item a').each(function() {
    var itemid=$(this).attr('id');
//    $(this).attr('href', '/editDraf?msgid='+post.msgid);
  });
  
  $('.itemImage').each(function() {
    var image=$(this).attr('image');
    $(this).attr('src', '/images/'+image);
  });
}

$(document).ready(function() {
  ko.applyBindings(model);    
  
  login(model);
  
  item.inventory(function(results) {
    log('items: '+results);
    
    model.empty(results.length==0);
    
    for(var index in results)
    {
      var item=results[index];
      model.items.push(item);
    }
    
    fixLinks();
  });    
});
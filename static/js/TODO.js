var model={
  admin: ko.observable(false),
  todos: ko.observableArray([]),
  empty: ko.observable(true),
  logout: ko.observable('')
};

function addTODO()
{
  log('add TODO');
  var name=$('#todoField').val();
  $('#todoField').val('');
  
  todo.add(name, function(result) {
    model.todos.push(result);    
  });
    
  return false;
}

$(document).ready(function() {  
  ko.applyBindings(model);
   
  login(model);   
  
  $('#addButton').click(addTODO);
     
  todo.list(function(result) {
    log(result);
    
    model.empty(result.length==0);
    
    for(var index in result)
    {
      var item=result[index];
      model.todos.push(item);
    }
  });
});

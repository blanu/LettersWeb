var key=null;

var model={
  aspects: ko.observableArray([]),
  aspectOptions: ko.observableArray([]),
  members: ko.observableArray([]),
  empty: ko.observable(true),
  admin: ko.observable(false),
  logout: ko.observable('')
};

function loadAspects()
{
  log('loading aspects');
  item.aspects(key, function(results) {
    model.empty(results.length==0);

    model.aspects.removeAll();
    
    for(var index in results)
    {
      var result=results[index];
      model.aspects.push(result);
    }    
  });
}

function attachAspect()
{
  log('attach aspect');
  var aspectKey=$('#aspectOptions').val();
  item.attach(key, aspectKey, function() {
    loadAspects();
  });
}

function giftItem()
{
  log('gift item');
  var memberKey=$('#members').val();
  item.gift(key, memberKey, function() {
    log('Gifted item');
  });
}

function saveItem()
{
  log('save item');
  
  var name=$('#nameInput').val();  
  var image=$('#imageInput').val();
  
  log('saving '+key+' '+name+' '+image);
  
  item.save(key, name, image);
}

$(document).ready(function() {
  key=$.query.get('key');

  ko.applyBindings(model);
  
  login(model);

  $('#addButton').click(attachAspect);
  $('#giftButton').click(giftItem);
  $('#saveButton').click(saveItem);
  
  loadAspects();
  
  item.get(key, function(result) {
    $('#nameInput').val(result.name);
    if(result.image)
    {
      $('#imageInput').val(result.image);
    }
  });
  
  aspect.list(function(results) {
    for(var index in results)
    {
      var result=results[index];
      model.aspectOptions.push(result);
    }    
  });  
  
  member.list(function(results) {
    for(var index in results)
    {
      var result=results[index];
      model.members.push(result);
    }    
  });    
});
function addSalon()
{
  log('add salon');
  var name=$('#nameField').val();
  var displayName=$('#displayNameField').val();
  salon.add(name, displayName);
}

$(document).ready(function () {
  $('#addButton').click(addSalon);
});
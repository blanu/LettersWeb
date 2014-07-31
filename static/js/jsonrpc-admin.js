application={
  list: function(callback)
  {
    jsonrpcCallback('/admin/api/application', 'list', [], callback);
  },
  get: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/application', 'get', [appid], callback);
  },
  approve: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/application', 'approve', [appid], callback);
  },
  reject: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/application', 'reject', [appid], callback);
  }
};

salon={
  add: function(name, displayName)
  {
    jsonrpc('/admin/api/salon', 'add', [name, displayName]);
  },
  delete: function(name)
  {
    jsonrpc('/admin/api/salon', 'delete', [name]);
  }
}

aspect={
  list: function(callback)
  {
    jsonrpcCallback('/admin/api/aspect', 'list', [], callback);
  },
  get: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/aspect', 'get', [appid], callback);
  },
  add: function(name, callback)
  {
    jsonrpcCallback('/admin/api/aspect', 'add', [name], callback);
  },
  delete: function(name)
  {
    jsonrpc('/admin/api/aspect', 'delete', [name]);
  }
}

item={
  list: function(callback)
  {
    jsonrpcCallback('/admin/api/item', 'list', [], callback);
  },
  get: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/item', 'get', [appid], callback);
  },
  add: function(name, image, callback)
  {
    jsonrpcCallback('/admin/api/item', 'add', [name, image], callback);
  },
  delete: function(name)
  {
    jsonrpc('/admin/api/item', 'delete', [name]);
  },
  aspects: function(key, callback)
  {
    jsonrpcCallback('/admin/api/item', 'aspects', [key], callback);
  },
  attach: function(item, aspect, callback)
  {
    jsonrpcCallback('/admin/api/item', 'attach', [item, aspect], callback);
  },
  gift: function(item, member, callback)
  {
    jsonrpcCallback('/admin/api/item', 'gift', [item, member], callback);
  },
  save: function(key, name, image)
  {
    jsonrpc('/admin/api/item', 'save', [key, name, image]);
  }
}

member={
  list: function(callback)
  {
    jsonrpcCallback('/admin/api/member', 'list', [], callback);
  },
  get: function(appid, callback)
  {
    jsonrpcCallback('/admin/api/member', 'get', [appid], callback);
  }
}
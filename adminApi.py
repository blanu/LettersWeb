from datetime import datetime

import logging

from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import db

from rpc import JsonRpcService
from models import *
from fate import *

class MemberService(JsonRpcService):
  def encodeMember(self, item):
    return {'key': str(item.key()), 'name': str(item.name)}

  def json_list(self):
    logging.info('ADMIN ACTION(Member): list')
    if not users.is_current_user_admin():
      return None

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    results=[]
    items=Member.all().order('name').fetch(100)
    for item in items:
      results.append(self.encodeMember(item))
    return results

  def json_get(self, appid):
    logging.info('ADMIN ACTION(Member): get')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Member.get(key)
      if app:
        return self.encodeMember(item)
      else:
        return None
    else:
      return None

class AspectService(JsonRpcService):
  def encodeAspect(self, item):
    return {'key': str(item.key()), 'name': str(item.name)}

  def json_add(self, name):
    logging.info('ACTION(Aspect): add')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Aspect.all().filter("name =", name).get()
    if item:
      logging.info("Aspect already exists")
      return None
    else:
      item=Aspect(name=name)
      item.save()
      logging.info(item);
      return self.encodeAspect(item)

  def json_list(self):
    logging.info('ADMIN ACTION(Aspect): list')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      results=[]
      items=Aspect.all().order('name').fetch(100)
      for item in items:
        results.append(self.encodeAspect(item))
      return results
    else:
      return None

  def json_get(self, appid):
    logging.info('ADMIN ACTION(Aspect): get')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Aspect.get(key)
      if app:
        return self.encodeAspect(item)
      else:
        return None
    else:
      return None

class ItemService(JsonRpcService):
  def encodeItem(self, item):
    return {'key': str(item.key()), 'name': str(item.name), 'image': str(item.image)}

  def json_add(self, name, image):
    logging.info('ACTION(Item): add')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Item.all().filter("name =", name).get()
    if item:
      logging.info("Aspect already exists")
      return None
    else:
      item=Item(name=name, image=image)
      item.save()
      logging.info(item);
      return self.encodeItem(item)

  def json_save(self, itemKey, name, image):
    logging.info('ACTION(Item): save')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Item.get(db.Key(itemKey))
    if item:
      item.name=name
      item.image=image
      item.save()

  def json_list(self):
    logging.info('ADMIN ACTION(Item): list')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      results=[]
      items=Item.all().order('name').fetch(100)
      for item in items:
        results.append(self.encodeItem(item))
      return results
    else:
      return None

  def json_get(self, appid):
    logging.info('ADMIN ACTION(Item): get')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Item.get(key)
      if app:
        return self.encodeItem(app)
      else:
        return None
    else:
      return None

  def json_aspects(self, itemKey):
    logging.info('ADMIN ACTION(Item): aspects')
    if not users.is_current_user_admin():
      return False

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    i=Item.get(db.Key(itemKey))
    if i:
      results=[]
      items=AttachedAspect.all().filter('item =', i).fetch(100)
      for item in items:
        results.append({'key': str(item.aspect.key()), 'name': item.aspect.name})
      return results
    else:
      return None

  def json_attach(self, itemKey, aspectKey):
    logging.info('ACTION(Item): attach')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Item.get(db.Key(itemKey))
    if item:
      aspect=Aspect.get(db.Key(aspectKey))
      if aspect:
        attached=AttachedAspect.all().filter('item =', item).filter('aspect =', aspect).get()
        if not attached:
          attached=AttachedAspect(item=item, aspect=aspect)
          attached.save()
          return True

    return False

  def json_gift(self, itemKey, memberKey):
    logging.info('ACTION(Item): attach')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Item.get(db.Key(itemKey))
    if item:
      member=Member.get(db.Key(memberKey))
      if member:
        inventory=Inventory.all().filter('item =', item).filter('member =', member).get()
        if not inventory:
          inventory=Inventory(item=item, member=member)
          inventory.save()
          return True

    return False

class ApplicationService(JsonRpcService):
  def json_list(self):
    logging.info('ADMIN ACTION(Application): list')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      results=[]
      items=Application.all().fetch(100)
      for item in items:
        results.append({'key': str(item.key()), 'user': str(item.user), 'username': str(item.username), 'status': item.status})
      return results
    else:
      return None

  def json_get(self, appid):
    logging.info('ADMIN ACTION(Application): get')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Application.get(key)
      if app:
        return {'user': str(app.user), 'username': str(app.username), 'essay': str(app.essay)}
      else:
        return None
    else:
      return None

  def json_approve(self, appid):
    logging.info('ADMIN ACTION(Application): get')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Application.get(key)
      if app:
        app.status="approved"
        app.save()

        member=Member.all().filter('name =', app.username).get()
        if not member:
          member=Member(user=app.user, name=app.username)
          member.save()
          return True
        else:
          logging.error('Username conflict: %s/%s' % (member.name, app.username))
          app.status="conflicted"
          app.save()
          return False
      else:
        return False
    else:
      return False

  def json_reject(self, appid):
    logging.info('ADMIN ACTION(Application): get')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    if users.is_current_user_admin():
      key=db.Key(appid)
      app=Application.get(key)
      if app:
        app.status="rejected"
        app.save()
        return True
      else:
        return False
    else:
      return False

class SalonService(JsonRpcService):
  def json_add(self, name, displayName):
    logging.info('ACTION(Salon): add')
#    if not users.is_current_user_admin():
#      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Salon.all().filter("name =", name).get()
    if item:
      logging.info("Item already exists")
      return False
    else:
      item=Salon(name=name, displayName=displayName)
      item.save()
      logging.info(item);
      return True

  def json_delete(self, name):
    logging.info('ACTION(Salon): delete')
    if not users.is_current_user_admin():
      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    item=Salon.all().filter("name =", name).get()
    if item:
      item.delete()
      return True
    else:
      return False

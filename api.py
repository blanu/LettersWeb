from datetime import datetime

import logging

from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext import db

from rpc import JsonRpcService
from models import *
from fate import *

class UserService(JsonRpcService):
  def json_isLoggedIn(self):
    user = users.get_current_user()
    logging.info('isLoggedIn '+str(user));
    return user!=None

  def json_isAdmin(self):
    return users.is_current_user_admin()

  def json_isMember(self):
    user = users.get_current_user()
    if user:
      member=Member.all().filter("user =", user).get()
      if member:
        return True
      else:
        return False
    else:
      return False

  def json_login(self):
    return users.create_login_url('/salons')

  def json_logout(self):
    return users.create_logout_url('/')

  def json_apply(self, username, essay):
    user = users.get_current_user()
    if user:
      application = Application.all().filter("user =", user).get()
      if not application:
        application = Application(user=user, essay=essay, status="processing", username=username)
        application.save()
        return True
      else:
        return False
    else:
      return False

  def json_hasApplied(self):
    user = users.get_current_user()
    if user:
      application = Application.all().filter("user =", user).get()
      return application!=None
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

  def json_list(self):
    logging.info('ACTION(Salon): list')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    results=[]
    items=Salon.all().order('displayName').fetch(100)
    for item in items:
      results.append({'name': item.name, 'displayName': item.displayName})
    return results

  def json_getDisplayName(self, name):
    logging.info('ACTION(Salon): getDisplayName')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    salon=Salon.all().filter("name =", name).get()
    if salon:
      return salon.displayName
    else:
      return None

  def json_getThreads(self, name):
    logging.info('ACTION(Salon): getThreads')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    salon=Salon.all().filter("name =", name).get()
    if salon:
      results=[]
      posts=Post.all().filter("salon =", salon).filter("replyto =", None).filter('draft =', False).fetch(100)
      for post in posts:
        results.append({'subject': str(post.subject), 'body': str(post.body), 'msgid': str(post.key())})
      logging.info(results)
      return results
    else:
      return []

class DraftService(JsonRpcService):
  def json_add(self, name, subject, body, replyto, draft):
    logging.info('ACTION(Post): addDraft')
#    if not users.is_current_user_admin():
#      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))
    logging.info('addDraft %s %s %s %s %s' % (name, subject, user, body, replyto))

    salon=Salon.all().filter("name =", name).get()
    if salon:
      member=Member.all().filter("user =", user).get()
      if member:
        if replyto:
          post=Post(salon=salon, draft=draft, author=member, date=datetime.now(), subject=subject, body=body, replyto=db.Key(replyto))
        else:
          post=Post(salon=salon, draft=draft, author=member, date=datetime.now(), subject=subject, body=body)
        post.save()
        logging.info(post);
        return str(post.key())
      else:
        return None
    else:
      return None

  def json_list(self):
    logging.info('ACTION(Post): list')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    if member:
      results=[]
      posts=Post.all().filter("author =", member).filter('draft =', True).fetch(100)
      for post in posts:
        results.append({'salon': str(post.salon.name), 'subject': str(post.subject), 'body': str(post.body), 'msgid': str(post.key())})
      logging.info(results)
      return results
    else:
      return None

  def json_get(self, msgid):
    logging.info('ACTION(Draft): get')
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    key=db.Key(msgid)
    post=Post.get(key)
    if post and member and post.author.user==member.user:
      return {'salon': str(post.salon.name), 'subject': str(post.subject), 'body': str(post.body), 'msgid': str(post.key())}
    else:
      return None

  def json_remove(self, msgid):
    logging.info('ACTION(Draft): delete')
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    key=db.Key(msgid)
    post=Post.get(key)
    if post and member and post.author.user==member.user and post.draft:
      post.delete()
      return True
    else:
      return False

  def json_save(self, msgid, subject, body, postit):
    logging.info('ACTION(Draft): save')
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    key=db.Key(msgid)
    post=Post.get(key)
    if post and member and post.author.user==member.user and post.draft:
      post.subject=subject
      post.body=body
      if postit:
        post.draft=False
        logging.info('Posted draft')
      post.save()
      logging.info('Saved draft')
    else:
      logging.error('Could not save draft, wrong author or not draft %s/%s %s' % (post.author, member, post.draft))

class PostService(JsonRpcService):
  def json_get(self, msgid):
    logging.info('ACTION(Post): get')
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    key=db.Key(msgid)
    post=Post.get(key)
    if post and member:
      return self.encode(post)
    else:
      return None

  def encode(self, post):
    return {'salon': str(post.salon.name), 'subject': str(post.subject), 'body': str(post.body), 'msgid': str(post.key()), 'children': self.getChildren(post), 'author': post.author.name}

  def encodeHeader(self, post):
    return {'subject': str(post.subject), 'msgid': str(post.key()), 'author': post.author.name}

  def getChildren(self, parent):
    posts=Post.all().filter('replyto =', parent).filter('draft =', False).fetch(100)
    return map(self.encodeHeader, posts)

class ItemService(JsonRpcService):
  def json_inventory(self):
    logging.info('ACTION(Item): inventory')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    if member:
      results=[]
      items=Inventory.all().filter("member =", member).fetch(100)
      for item in items:
        results.append({'key': str(item.item.key()), 'name': item.item.name, 'image': item.item.image})
      logging.info(results)
      return results
    else:
      return None

class TODOService(JsonRpcService):
  def encode(self, todo):
    if todo.category:
      return {'category': todo.category, 'text': todo.text, 'author': todo.author.name, 'id': str(todo.key())}
    else:
      return {'text': todo.text, 'author': todo.author.name, 'id': str(todo.key())}

  def json_add(self, text):
    logging.info('ACTION(TODO): add')
#    if not users.is_current_user_admin():
#      return False
    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    if member:
      todo=TODO(author=member, date=datetime.now(), text=text)
      todo.save()
      logging.info(todo);
      return self.encode(todo)
    else:
      return None

  def json_list(self):
    logging.info('ACTION(Post): list')

    user = users.get_current_user()
    logging.info('rpc user '+str(user))

    member=Member.all().filter("user =", user).get()
    if member:
      results=[]
      todos=TODO.all().order('date').fetch(100)
      for todo in todos:
        results.append(self.encode(todo))
      return results
    else:
      return None

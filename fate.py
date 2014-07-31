from google.appengine.ext import db
from google.appengine.ext import blobstore

from models import Member

class Aspect(db.Model):
  name=db.StringProperty(required=True)

class Item(db.Model):
  name=db.StringProperty(required=True)
  image=db.StringProperty(required=False)

class AttachedAspect(db.Model):
  aspect=db.ReferenceProperty(Aspect, required=True)
  item=db.ReferenceProperty(Item, required=True)

class Inventory(db.Model):
  item=db.ReferenceProperty(Item, required=True)
  member=db.ReferenceProperty(Member, required=True)

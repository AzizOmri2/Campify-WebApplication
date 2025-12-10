from mongoengine import Document, StringField, FloatField, IntField, ListField

class Product(Document):
    name = StringField(max_length=255, required=True)       # Product name
    price = FloatField(required=True)                       # Product price
    category = StringField(max_length=100, required=True)   # Product category
    stock = IntField(default=0)                             # Number of items in stock
    description = StringField(max_length=1000)              # Product description
    features = ListField(StringField(max_length=200))       # List of features

    image_url = StringField()    # optional URL

    def __str__(self):
        return self.name
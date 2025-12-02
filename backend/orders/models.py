from mongoengine import (
    Document, EmbeddedDocument, StringField, ListField, EmbeddedDocumentField,
    DecimalField, BooleanField, DateTimeField
)
from datetime import datetime

class Address(EmbeddedDocument):
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    email = StringField(required=True)
    address = StringField(required=True)
    city = StringField(required=True)
    zip = StringField(required=True)

class OrderItem(EmbeddedDocument):
    product_id = StringField(required=True)
    name = StringField(required=True)      # product name
    price = DecimalField(required=True, precision=2)
    quantity = DecimalField(required=True, precision=0)

class Order(Document):
    user_id = StringField(required=True)
    items = ListField(EmbeddedDocumentField(OrderItem))
    amount = DecimalField(required=True, precision=2)
    address = EmbeddedDocumentField(Address, required=True)
    status = StringField(
        choices=['pending', 'paid', 'shipped', 'completed', 'cancelled'],
        default='pending'
    )
    payment = BooleanField(default=False)
    date = DateTimeField(default=datetime.utcnow)

from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocument, EmbeddedDocumentField, IntField, FloatField
import bcrypt


# 🔹 Items stored inside cartData
class CartItem(EmbeddedDocument):
    product_id = StringField(required=True)
    name = StringField(required=True)
    price = FloatField(required=True)
    quantity = IntField(default=1)


class User(Document):
    full_name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)

    # 🔥 Cart saved directly inside User document
    cartData = ListField(EmbeddedDocumentField(CartItem), default=[])

    def set_password(self, raw_password):
        self.password = bcrypt.hashpw(raw_password.encode(), bcrypt.gensalt()).decode()

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode(), self.password.encode())
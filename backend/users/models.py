from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocument, EmbeddedDocumentField, IntField, FloatField, DateTimeField
import bcrypt
from datetime import datetime, timedelta
import uuid


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

    # ✅ New fields
    ROLE_CHOICES = ("Admin", "User")
    role = StringField(choices=ROLE_CHOICES, default="User")
    status = StringField(default="Active")  # Active / Inactive
    joined = DateTimeField(default=datetime.utcnow)

    # 📌 Password reset fields
    reset_token = StringField()
    reset_token_expiry = DateTimeField()

    def set_password(self, raw_password):
        self.password = bcrypt.hashpw(raw_password.encode(), bcrypt.gensalt()).decode()

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode(), self.password.encode())

    # 🔹 Generate a reset token valid for 1 hour
    def generate_reset_token(self):
        token = str(uuid.uuid4())
        self.reset_token = token
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        self.save()
        return token

    # 🔹 Clear reset token after use
    def clear_reset_token(self):
        self.reset_token = None
        self.reset_token_expiry = None
        self.save()
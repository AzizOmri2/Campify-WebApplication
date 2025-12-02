from .models import User, CartItem
from products.models import Product


def serialize_cart(cart_items):
    """
    Converts CartItem objects to JSON-serializable dicts
    with full product data.
    """
    serialized = []
    for item in cart_items:
        # Fetch full product info from Product collection
        product = Product.objects(id=item.product_id).first()
        if not product:
            continue  # skip if product doesn't exist

        serialized.append({
            "_id": str(product.id),
            "name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "category": product.category,
            "image": getattr(product, "image", ""),
            "stock": getattr(product, "stock", 0),
            "description": getattr(product, "description", ""),
            "features": getattr(product, "features", []),
        })
    return serialized


def get_cart(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"items": []}

        return {"items": serialize_cart(user.cartData)}
    except Exception:
        return {"items": []}


def add_to_cart(user_id, product_id):
    user = User.objects(id=user_id).first()
    product = Product.objects(id=product_id).first()
    if not user or not product:
        return {"items": []}

    # Check if product already in cart
    for item in user.cartData:
        if item.product_id == str(product_id):
            item.quantity += 1
            user.save()
            return {"items": serialize_cart(user.cartData)}

    # Add new product to cart
    user.cartData.append(CartItem(
        product_id=str(product_id),
        name=product.name,  # optional, can remove if always fetching full product
        price=product.price,
        quantity=1
    ))
    user.save()
    return {"items": serialize_cart(user.cartData)}


def update_quantity(user_id, product_id, qty):
    user = User.objects(id=user_id).first()
    if not user:
        return {"items": []}

    for item in user.cartData:
        if item.product_id == str(product_id):
            item.quantity = qty
            user.save()
            return {"items": serialize_cart(user.cartData)}

    return {"items": serialize_cart(user.cartData)}


def remove_from_cart(user_id, product_id):
    user = User.objects(id=user_id).first()
    if not user:
        return {"items": []}

    user.cartData = [item for item in user.cartData if item.product_id != str(product_id)]
    user.save()
    return {"items": serialize_cart(user.cartData)}


def clear_cart(user_id):
    user = User.objects(id=user_id).first()
    if not user:
        return {"items": []}

    user.cartData = []
    user.save()
    return {"items": []}

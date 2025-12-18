from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from users.models import User
from orders.models import Order
from products.models import Product


def percent_change(current, previous):
    if previous == 0:
        return 100 if current > 0 else 0
    return round(((current - previous) / previous) * 100, 2)


@api_view(["GET"])
def dashboard_stats(request):
    now = timezone.now()

    # ---- Date ranges ----
    start_current = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_previous = (start_current - timedelta(days=1)).replace(day=1)
    end_previous = start_current - timedelta(seconds=1)

    # ---- Revenue ----
    current_orders = Order.objects(status="paid", date__gte=start_current)
    previous_orders = Order.objects(status="paid", date__gte=start_previous, date__lte=end_previous)

    current_revenue = sum(float(o.amount) for o in current_orders)
    previous_revenue = sum(float(o.amount) for o in previous_orders)

    # ---- Orders count ----
    current_orders_count = Order.objects(date__gte=start_current).count()
    previous_orders_count = Order.objects(date__gte=start_previous, date__lte=end_previous).count()

    # ---- Users ----
    current_users = User.objects(joined__gte=start_current).count()
    previous_users = User.objects(joined__gte=start_previous, joined__lte=end_previous).count()
    active_users_count = User.objects(status="Active").count()

    # ---- Recent orders (latest 5) ----
    recent_orders = []
    for o in Order.objects.order_by('-date')[:5]:
        recent_orders.append({
            "id": str(o.id),
            "user": o.user.full_name if o.user else "Guest",
            "amount": float(o.amount),
            "items_count": len(o.items),
            "status": o.status,
            "date": o.date.isoformat()
        })

    # ---- Top products (by number of times ordered, latest 5) ----
    product_sales = {}
    for o in Order.objects:
        for item in o.items:
            product_sales[item.name] = product_sales.get(item.name, 0) + int(item.quantity)

    top_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:5]
    top_products_list = []
    for name, sales in top_products:
        product = Product.objects(name=name).first()  # safely get the first match
        if product:
            top_products_list.append({
                "name": product.name,
                "price": float(product.price),
                "sales": sales,
                "image_url": product.image_url or ""
            })

    return Response({
        "totalRevenue": round(current_revenue, 2),
        "revenueChange": percent_change(current_revenue, previous_revenue),

        "orders": current_orders_count,
        "ordersChange": percent_change(current_orders_count, previous_orders_count),

        "products": Product.objects.count(),

        "activeUsers": active_users_count,
        "usersChange": percent_change(current_users, previous_users),

        "recentOrders": recent_orders,
        "topProducts": top_products_list
    })
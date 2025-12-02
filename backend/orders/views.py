from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from users.models import User
from .models import Order, OrderItem, Address


class CheckoutView(APIView):
    def post(self, request, user_id, *args, **kwargs):
        # 1. Fetch user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # 2. Check if cart exists
        if not user.cartData or len(user.cartData) == 0:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Calculate total amount
        total = sum(Decimal(item['price']) * Decimal(item['quantity']) for item in user.cartData)

        # 4. Create OrderItem objects
        order_items = [
            OrderItem(
                product_id=item.product_id,
                name=item.name,
                price=Decimal(item.price),
                quantity=Decimal(item.quantity),
            ) for item in user.cartData
        ]

        # 5. Create Address object
        address_data = request.data.get('address')
        if not address_data:
            return Response({"error": "Address data is required"}, status=status.HTTP_400_BAD_REQUEST)

        order_address = Address(**address_data)

        # 6. Create Order
        order = Order.objects.create(
            user_id=str(user.id),
            items=order_items,
            amount=total,
            address=order_address,
            status='paid',
            payment=True
        )

        # 7. Clear user's cart
        user.cartData = []
        user.save()

        return Response({"message": "Order created", "order_id": str(order.id)}, status=status.HTTP_201_CREATED)


class UserOrdersView(APIView):
    def get(self, request, user_id):
        try:
            orders = Order.objects(user_id=user_id).order_by('-date')

            orders_list = []
            for order in orders:
                orders_list.append({
                    "_id": str(order.id),
                    "items": [
                        {
                            "product_id": item.product_id,
                            "name": item.name,
                            "price": float(item.price),
                            "quantity": float(item.quantity),
                        }
                        for item in order.items
                    ],
                    "amount": float(order.amount),
                    "address": {
                        "first_name": order.address.first_name,
                        "last_name": order.address.last_name,
                        "email": order.address.email,
                        "address": order.address.address,
                        "city": order.address.city,
                        "zip": order.address.zip,
                    },
                    "status": order.status,
                    "payment": order.payment,
                    "date": order.date.isoformat(),
                })

            return Response(orders_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
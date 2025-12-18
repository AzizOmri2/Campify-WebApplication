from django.urls import path
from .views import CheckoutView, UserOrdersView, AllOrdersView, DeleteOrderView, GetOrderByIdView

urlpatterns = [
    path('checkout/<str:user_id>/', CheckoutView.as_view(), name='checkout'),
    path('<str:order_id>/delete/', DeleteOrderView.as_view(), name='delete-order'),
    path('<str:user_id>/', UserOrdersView.as_view(), name='user-orders'),
    path('order/<str:order_id>/', GetOrderByIdView.as_view(), name='get-order-by-id'),
    path("", AllOrdersView.as_view()),
]
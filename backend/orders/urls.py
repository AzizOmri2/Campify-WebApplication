from django.urls import path
from .views import CheckoutView, UserOrdersView

urlpatterns = [
    path('checkout/<str:user_id>/', CheckoutView.as_view(), name='checkout'),
    path('<str:user_id>/', UserOrdersView.as_view(), name='user-orders'),
]
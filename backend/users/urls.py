from django.urls import path
from .views import (
    RegisterUser, LoginUser,
    get_user_cart, add_user_cart, update_user_cart, remove_user_cart, clear_user_cart
)


urlpatterns = [
    path('register', RegisterUser.as_view(), name='register'),
    path('login', LoginUser.as_view()),

    # Cart API
    path("cart/<str:user_id>/", get_user_cart),
    path("cart/<str:user_id>/add/", add_user_cart),
    path("cart/<str:user_id>/update/", update_user_cart),
    path("cart/<str:user_id>/remove/", remove_user_cart),
    path("cart/<str:user_id>/clear/", clear_user_cart),
]
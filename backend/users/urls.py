from django.urls import path
from .views import (
    RegisterUser, LoginUser, DeleteUser, BanUser, UnBanUser,
    get_user_cart, add_user_cart, update_user_cart, remove_user_cart, clear_user_cart, get_all_users
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

    # Admin Panel
    path("admin", get_all_users),
    path("admin/<str:user_id>/delete/", DeleteUser.as_view(), name="delete_user"),
    path("admin/<str:user_id>/ban/", BanUser.as_view(), name="ban_user"),
    path("admin/<str:user_id>/unban/", UnBanUser.as_view(), name="unban_user"),
]
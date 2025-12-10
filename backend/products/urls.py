from django.urls import path
from .views import ProductListView, ProductDetailView, ProductCreateView, ProductUpdateView, ProductDeleteView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    
    path('<str:product_id>', ProductDetailView.as_view(), name='product-detail'),

    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('<str:product_id>/update/', ProductUpdateView.as_view(), name='product-update'),
    path('<str:product_id>/delete/', ProductDeleteView.as_view(), name='product-delete'),

    
]
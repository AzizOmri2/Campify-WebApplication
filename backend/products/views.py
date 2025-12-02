from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from mongoengine.errors import DoesNotExist
from .models import Product

class ProductListView(APIView):
    """
    GET /api/products/
    Returns a list of all products
    """
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects()  # fetch all products from MongoDB
        data = [
            {
                "_id": str(p.id),  # MongoEngine ObjectId
                "name": p.name,
                "price": p.price,
                "category": p.category,
                "image": p.image,
                "stock": p.stock,
                "description": getattr(p, "description", ""),  # optional
                "features": getattr(p, "features", []),       # optional
            }
            for p in products
        ]
        return Response(data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    """
    GET /api/products/<product_id>/
    Returns a single product by its ID
    """
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=ObjectId(product_id))
            data = {
                "_id": str(product.id),
                "name": product.name,
                "price": product.price,
                "category": product.category,
                "image": product.image,
                "stock": product.stock,
                "description": getattr(product, "description", ""),
                "features": getattr(product, "features", []),
            }
            return Response(data, status=status.HTTP_200_OK)
        except DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from mongoengine.errors import DoesNotExist
from .models import Product
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json


class ProductListView(APIView):
    """
    GET /api/products/
    Returns a list of all products
    """
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects()
        data = [serialize_product(p) for p in products]
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
            data = serialize_product(product)
            return Response(data, status=status.HTTP_200_OK)
        except DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


class ProductCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        product = Product(
            name=data.get("name", ""),
            price=float(data.get("price", 0)),
            category=data.get("category", ""),
            stock=int(data.get("stock", 0)),
            description=data.get("description", ""),
            features = data.getlist("features")
        )

        # Handle image: file upload or URL
        if "image_file" in request.FILES:
            image_file = request.FILES["image_file"]
            # Save to products folder
            upload_path = os.path.join("products", image_file.name)
            saved_path = default_storage.save(upload_path, ContentFile(image_file.read()))
            product.image_url = saved_path  # just save the filename/path
        else:
            product.image_url = data.get("image_url", "")

        product.save()
        return Response({"_id": str(product.id)}, status=status.HTTP_201_CREATED)


class ProductUpdateView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, product_id):
        try:
            product = Product.objects.get(id=ObjectId(product_id))

            # Handle standard fields
            for field in ["name", "category", "description"]:
                if field in request.data:
                    setattr(product, field, request.data[field])

            # Convert price and stock to numbers
            if "price" in request.data:
                try:
                    product.price = float(request.data["price"])
                except ValueError:
                    return Response({"error": "Price must be a number"}, status=400)

            if "stock" in request.data:
                try:
                    product.stock = int(request.data["stock"])
                except ValueError:
                    return Response({"error": "Stock must be an integer"}, status=400)

            # Convert features to list if sent as JSON string
            if "features" in request.data:
                features = request.data.getlist("features")
                if isinstance(features, str):
                    try:
                        features = json.loads(features)
                    except json.JSONDecodeError:
                        return Response({"error": "Features must be a valid JSON array"}, status=400)
                if not isinstance(features, (list, tuple)):
                    return Response({"error": "Features must be a list"}, status=400)
                product.features = features

            # Handle image
            if "image_file" in request.FILES:
                image_file = request.FILES["image_file"]
                upload_path = os.path.join("products", image_file.name)
                saved_path = default_storage.save(upload_path, ContentFile(image_file.read()))
                product.image_url = saved_path
            elif "image_url" in request.data:
                product.image_url = request.data.get("image_url", "")

            product.save()
            return Response({"message": "Product updated"}, status=status.HTTP_200_OK)

        except DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


class ProductDeleteView(APIView):
    """
    DELETE /api/products/<product_id>/
    Deletes a product
    """
    permission_classes = [AllowAny]

    def delete(self, request, product_id):
        try:
            product = Product.objects.get(id=ObjectId(product_id))
            
            # Delete image file from disk if it's a local file
            if product.image_url and not product.image_url.startswith("http://") and not product.image_url.startswith("https://"):
                if default_storage.exists(product.image_url):
                    default_storage.delete(product.image_url)
            
            # Delete the product document
            product.delete()
            
            return Response({"message": "Product and its image deleted"}, status=status.HTTP_200_OK)
        
        except DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


def serialize_product(product):
    """
    Serialize product to dict, only using image_url
    """
    return {
        "_id": str(product.id),
        "name": product.name,
        "price": product.price,
        "category": product.category,
        "stock": product.stock,
        "description": getattr(product, "description", ""),
        "features": getattr(product, "features", []),
        "image_url": product.image_url,
    }
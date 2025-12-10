from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .models import User
from rest_framework.decorators import api_view
from datetime import datetime
from .cart_service import (
    get_cart, add_to_cart, update_quantity, remove_from_cart, clear_cart
)


class RegisterUser(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,  # indicates successful registration
                "message": "User registered successfully"
            }, status=201)

        # If validation fails (e.g., email exists)
        return Response({
            "success": False,
            "errors": serializer.errors  # will include messages like "This email is already registered"
        }, status=400)


class LoginUser(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "Invalid email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if not user.check_password(password):
            return Response({
                "success": False,
                "message": "Invalid email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)

        # You might need a custom JWT generation for MongoEngine users
        # Example: using `simplejwt` requires a Django User model
        # Or use another library like `jwt`:
        import jwt
        from datetime import datetime, timedelta
        SECRET_KEY = "your-secret-key"  # from Django settings
        payload = {
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        access_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return Response({
            "success": True,
            "token": access_token,
            "message": "Logged in successfully",
            "user": {                   
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "role": getattr(user, "role", "Viewer"),
                "status": getattr(user, "status", "Active"),
                "joined": getattr(user, "joined", datetime.utcnow()).isoformat()
            }
        }, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_user_cart(request, user_id):
    return Response(get_cart(user_id))

@api_view(["POST"])
def add_user_cart(request, user_id):
    return Response(add_to_cart(user_id, request.data["product_id"]))

@api_view(["PUT"])
def update_user_cart(request, user_id):
    return Response(update_quantity(user_id, request.data["product_id"], request.data["quantity"]))

@api_view(["DELETE"])
def remove_user_cart(request, user_id):
    return Response(remove_from_cart(user_id, request.data["product_id"]))

@api_view(["DELETE"])
def clear_user_cart(request, user_id):
    return Response(clear_cart(user_id))

@api_view(["GET"])
def get_all_users(request):
    """
    Return all users with id, full_name, email, role, status, joined.
    """
    users_list = []
    for user in User.objects:
        users_list.append({
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "role": getattr(user, "role", "User"),
            "status": getattr(user, "status", "Active"),
            "joined": getattr(user, "joined", datetime.utcnow()).isoformat()
        })
    return Response(users_list)


class DeleteUser(APIView):
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()   # 🚀 CASCADE is executed here
            return Response({"message": "User and related orders deleted"}, status=200)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class BanUser(APIView):
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.status = "Inactive"
            user.save()
            return Response({"success": True, "message": "User has been banned"}, status=200)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

class UnBanUser(APIView):
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.status = "Active"
            user.save()
            return Response({"success": True, "message": "User has been unbanned"}, status=200)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)
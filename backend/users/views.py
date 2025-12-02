from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .models import User
from rest_framework.decorators import api_view
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

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "success": True,
            "token": access_token,
            "refresh": str(refresh),
            "message": "Logged in successfully",
            "user": {                   
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email
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
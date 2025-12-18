from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .models import User
from rest_framework.decorators import api_view
from datetime import datetime
from django.core.mail import send_mail
import os
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
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


class UpdateUser(APIView):
    """
    Update user details by user_id.
    """

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

        # Update allowed fields
        full_name = request.data.get("full_name")
        email = request.data.get("email")

        if full_name:
            user.full_name = full_name
        if email:
            # Check if email already exists for another user
            if User.objects(email=email, id__ne=user_id).first():
                return Response({"success": False, "message": "Email already in use"}, status=400)
            user.email = email

        user.save()

        return Response({
            "success": True,
            "message": "User updated successfully",
            "user": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "role": getattr(user, "role", "User"),
                "status": getattr(user, "status", "Active"),
                "joined": getattr(user, "joined").isoformat()
            }
        }, status=200)


class UpdatePassword(APIView):
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(old_password):
            return Response({"success": False, "message": "Old password is incorrect"}, status=400)

        if new_password != confirm_password:
            return Response({"success": False, "message": "New password and confirmation do not match"}, status=400)


        user.set_password(new_password)
        user.save()
        return Response({"success": True, "message": "Password updated successfully"}, status=200)


class ForgotPassword(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "No account found with this email"
            }, status=404)

        token = user.generate_reset_token()

        FRONTEND_URL = os.environ.get("ADMIN_FRONTEND_URL", "http://localhost:5174")
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"

        # Plain text fallback
        text_content = f"Click the link to reset your password: {reset_url}"

        # HTML content
        html_content = f"""
        <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #e6ebf1; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffffcc; padding: 30px; border-radius: 12px; 
                        box-shadow: 0px 8px 24px rgba(0,0,0,0.1); text-align: center;">

                <h2 style="color: #295214; font-size: 1.5rem; margin-bottom: 10px;">Reset Your Password</h2>
                <p style="color: #295214; font-size: 1rem; margin-bottom: 20px;">
                    Hi <strong>{user.full_name}</strong>, we received a request to reset your password.
                </p>

                <a href="{reset_url}" 
                style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600;
                        color: #fff; background-color: #295214; text-decoration: none; border-radius: 12px;
                        box-shadow: 0px 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                Reset Password
                </a>

                <p style="color: #6b7280; font-size: 0.9rem; margin-top: 24px;">
                    If you didn't request a password reset, just ignore this email.
                </p>
                <p style="color: #6b7280; font-size: 0.9rem;">
                    Thanks,<br/>
                    <strong>Campify - Admin Panel</strong>
                </p>
            </div>
        </body>
        </html>
        """

        msg = EmailMultiAlternatives(
            subject="Password Reset Request",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

        return Response({
            "success": True,
            "message": "Reset link sent! Check your inbox.."
        })


class ResetPassword(APIView):
    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("password")

        try:
            user = User.objects.get(reset_token=token)
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "Invalid or expired token"
            }, status=400)

        if not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
            return Response({
                "success": False,
                "message": "Token expired"
            }, status=400)

        user.set_password(new_password)
        user.clear_reset_token()

        return Response({
            "success": True,
            "message": "Password reset successfully"
        })


class InviteUser(APIView):
    def post(self, request):
        email = request.data.get("email")
        role = request.data.get("role", "User")

        if not email:
            return Response({"success": False, "message": "Email is required."}, status=400)

        FRONTEND_URL = os.environ.get("ADMIN_FRONTEND_URL", "http://localhost:5174")
        invite_url = f"{FRONTEND_URL}/?email={email}&role={role}"

        # Plain text fallback
        text_content = f"You are invited to join Campify! Register here: {invite_url}"

        # HTML email
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 12px;
                        box-shadow: 0px 8px 24px rgba(0,0,0,0.1); text-align: center;">
                <h2 style="color: #295214; font-size: 1.5rem; margin-bottom: 10px;">You're Invited!</h2>
                <p style="color: #295214; font-size: 1rem; margin-bottom: 20px;">
                    Hi, you have been invited to join <strong>Campify</strong> as a <strong>{role}</strong>.
                </p>
                <a href="{invite_url}" 
                   style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600;
                          color: #fff; background-color: #295214; text-decoration: none; border-radius: 12px;
                          box-shadow: 0px 4px 12px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                   Join Campify
                </a>
                <p style="color: #6b7280; font-size: 0.9rem; margin-top: 24px;">
                    If you didn't expect this invitation, you can ignore this email.
                </p>
                <p style="color: #6b7280; font-size: 0.9rem;">
                    Thanks,<br/>
                    <strong>Campify Team</strong>
                </p>
            </div>
        </body>
        </html>
        """

        msg = EmailMultiAlternatives(
            subject="Invitation to Join Campify",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

        return Response({"success": True, "message": f"Invitation sent to {email}."})
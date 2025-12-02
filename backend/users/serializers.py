from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        """Check if email is already registered"""
        if User.objects(email=value).first():  # MongoEngine query
            raise serializers.ValidationError("This email is already registered")
        return value

    def create(self, validated_data):
        user = User(
            full_name=validated_data['full_name'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
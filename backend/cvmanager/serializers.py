from rest_framework import serializers
from .models import CV


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = ["id", "first_name", "last_name", "email", "country", "cv_file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def validate_cv_file(self, value):
        if not value.name.endswith(".pdf"):
            raise serializers.ValidationError("Solo se permiten archivos PDF.")
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("El archivo no puede superar los 10 MB.")
        return value

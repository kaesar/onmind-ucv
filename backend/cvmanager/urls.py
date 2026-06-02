from django.urls import path
from .views import CVCreateView

urlpatterns = [
    path("upload/", CVCreateView.as_view(), name="cv-upload"),
]

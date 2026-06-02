from rest_framework import generics, status
from rest_framework.response import Response
from .models import CV
from .serializers import CVSerializer


class CVCreateView(generics.CreateAPIView):
    queryset = CV.objects.all()
    serializer_class = CVSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "CV recibido exitosamente", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

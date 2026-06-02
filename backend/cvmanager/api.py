from typing import Annotated

from django_bolt import BoltAPI, FileSize, UploadFile
from django_bolt.param_functions import File, Form

from .models import CV

api = BoltAPI()


@api.post("/api/upload")
async def cv_upload(
    first_name: Annotated[str, Form()],
    last_name: Annotated[str, Form()],
    email: Annotated[str, Form()],
    country: Annotated[str, Form()],
    cv_file: Annotated[
        UploadFile,
        File(
            max_size=FileSize.MB_10,
            allowed_types=["application/pdf"],
        ),
    ],
    url: Annotated[str, Form()] = "",
):
    cv = CV(
        first_name=first_name,
        last_name=last_name,
        email=email,
        country=country,
        url=url,
    )
    cv.cv_file = cv_file.file
    await cv.asave()

    return {
        "message": "CV recibido exitosamente",
        "data": {
            "id": cv.id,
            "first_name": cv.first_name,
            "last_name": cv.last_name,
            "email": cv.email,
            "country": cv.country,
            "url": cv.url,
            "cv_file": cv.cv_file.url,
            "uploaded_at": cv.uploaded_at.isoformat(),
        },
    }


@api.get("/api/cv-files")
async def list_cv_files():
    data = []
    async for cv in CV.objects.all():
        data.append({
            "id": cv.id,
            "full_name": f"{cv.first_name} {cv.last_name}",
            "file_name": cv.cv_file.name,
        })
    return {"data": data}

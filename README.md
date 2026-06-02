# UCV — Upload Curriculum Vitae

Aplicación para cargar currículum vitae (CV) mediante un formulario web.  
Frontend en **React + Vite**, backend en **Django REST Framework**, almacenamiento de archivos en **bucket S3** (**RustFS** o **Floci** en local) y base de datos **SQLite**.

## Estructura del proyecto

```
ucv/
├── backend/                          # Django REST API
│   ├── cvmanager/
│   │   ├── models.py                 # Modelo CV (firstName, lastName, email, country, cv_file)
│   │   ├── serializers.py            # Validación (solo PDF, ≤10 MB)
│   │   ├── views.py                  # POST /api/upload/ → 201 + mensaje
│   │   ├── urls.py                   # Ruta del endpoint
│   │   ├── admin.py                  # Registro en admin de Django
│   │   └── apps.py
│   ├── ucv/
│   │   ├── settings.py               # Configuración global (S3, CORS, SQLite, DRF)
│   │   ├── urls.py                   # Rutas raíz
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example                  # Variables de entorno (S3, secrets)
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── App.jsx                   # Formulario con validación y notificaciones
│   │   ├── App.css                   # Estilos del formulario
│   │   ├── index.css                 # Estilos globales
│   │   └── main.jsx                  # Punto de entrada
│   ├── index.html
│   ├── vite.config.js                # Proxy /api → Django
│   └── package.json
│
├── storage/                          # Folder to store CV files (.pdf)
│
└── README.md
```

## Requisitos

- **Python** 3.10+
- **Bun**
- Un servicio S3-compatible (Floci, RustFS, MinIO, AWS S3, etc.)

## Inicio rápido

Para inciar el servicio, se abre la carpeta `backend` y se ejecutan las sentencias para preparar el entorno virtual de **Python** y proyecto de **Django**. De modo semejante ocurre con el `frontend`, abriendo una terminal o sesión adicional.

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

> Recuerda editar `.env` con las credenciales **S3** correspondientes.  
> El backend queda disponible en `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
bun install
bun run dev
```

> El frontend se abre en `http://localhost:5173`.  
> El proxy de **Vite** redirige las peticiones `/api/*` al backend en `:8000`.

## Uso

1. Abrir `http://localhost:5173`
2. Completar: nombre, apellido, email, país (selector) y adjuntar CV (PDF)
3. Hacer clic en **Enviar**
4. Si es exitoso: notificación verde y el formulario se deshabilita
5. Si hay error: notificación roja con el detalle

## Endpoint API

| Método | Ruta             | Descripción                     |
|--------|------------------|----------------------------------|
| POST   | `/api/upload/`   | Sube un CV (multipart/form-data) |

### Campos del POST

| Campo       | Tipo     | Descripción                |
|-------------|----------|----------------------------|
| first_name  | string   | Nombre                     |
| last_name   | string   | Apellido                   |
| email       | string   | Correo electrónico         |
| country     | string   | País                       |
| cv_file     | file     | Archivo PDF (máx. 10 MB)   |

## Almacenamiento S3

Los archivos se guardan en un recipiente (bucket) S3 configurable vía variables de entorno.  
Si has instalado el binario de **RustFS**, puedes lanzar el servicio ejecutando:

```bash
rustfs server --address :9000 ./storage
```

> Se el volumen, por ejemplo, carpeta `storage`. El puerto apunta a `http://localhost:9000`.  

Recuerda crear el recipiente (bucket) antes de usar. Por ejemplo, usando la **API** de **RustFS**:

```bash
curl --location --request PUT 'http://localhost:9000/ubv-bucket' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

> La **API** se obtiene con la consola web (UI) de **RustFS** desde contenedor.  
> También se puede crear el recipiente (bucket) desde de allí.

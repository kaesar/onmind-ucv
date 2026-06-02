# OnMind-UCV — Upload Curriculum Vitae

Application to upload curriculum vitae (CV) through a web form.  
Frontend in **React + Vite**, backend in **Django + [Django-Bolt](https://onmind.net/code/es/Django)**, file storage in **S3 bucket** (**RustFS** or **Floci** locally) and **SQLite** database.

## Project structure

```
  ______
./ ucv /
│
├── backend/                          # Django API (Django-Bolt)
│   ├── cvmanager/
│   │   ├── api.py                    # POST /api/upload + GET /api/cv-files endpoints (Django-Bolt)
│   │   ├── models.py                 # CV model (firstName, lastName, email, country, url, cv_file)
│   │   ├── admin.py                  # Django admin registration
│   │   └── apps.py
│   ├── ucv/
│   │   ├── settings.py               # Global config (S3, CORS, Django-Bolt)
│   │   ├── urls.py                   # Root routes (admin)
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example                  # Environment variables (S3, secrets)
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── App.jsx                   # Form with validation and notifications
│   │   ├── App.css                   # Form styles
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # Entry point
│   ├── index.html
│   ├── vite.config.js                # Proxy /api -> Django
│   └── package.json
│
├── storage/                          # Folder to upload CV files (.pdf)
│
└── README.md
```

> Logic is centralized in `cvmanager/api.py` using [**Django-Bolt**](https://onmind.net/code/es/Django), an API framework powered by **Rust** (which replaces **Django REST Framework**).

## Prerequisites

- **Python** 3.10+
- **Bun**
- An S3-compatible service (RustFS, Floci, MinIO, AWS S3, etc.)

## Getting Started

To start the service, open the `backend` folder and run the commands to set up the **Python** virtual environment and **Django** project. Similarly, open an additional terminal for the `frontend`.

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runbolt --dev
```

> Service available at `http://localhost:8000`. **OpenAPI** docs at `http://localhost:8000/docs`.
> Remember to edit `.env` with the corresponding **S3** credentials.

### 2. Frontend

```bash
cd frontend
bun install
bun run dev
```

> The frontend opens at `http://localhost:5173`.  
> **Vite** proxy redirects `/api/*` requests to the backend on `:8000`.

## Usage

1. Open `http://localhost:5173`
2. Fill in: first name, last name, email, country (selector) and attach CV (PDF)
3. Click **Submit**
4. On success: green notification and the form is disabled
5. On error: red notification with details

## API Endpoints

| Method | Route            | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/api/upload`    | Upload a CV (multipart/form-data) |
| GET    | `/api/cv-files`  | List CVs                         |

### POST endpoint fields

| Field      | Type   | Description                |
|------------|--------|----------------------------|
| first_name | string | First name                 |
| last_name  | string | Last name                  |
| email      | string | Email address              |
| country    | string | Country                    |
| url        | string | Website or LinkedIn URL    |
| cv_file    | file   | PDF file (max 10 MB)       |

## S3 Storage

Files are stored in a configurable S3 bucket via environment variables.  
If you have the **RustFS** binary installed, you can start the service by running:

```bash
rustfs server --address :9000 ./storage
```

> Use a volume, e.g., `storage` folder. The port points to `http://localhost:9000`.

Remember to create the bucket before using it. For example, using the **RustFS** **API**:

```bash
curl --location --request PUT 'http://localhost:9000/ucv-bucket' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

> The **API** credentials can be obtained from the web UI (console) of [**RustFS**](https://onmind.net/devops/es/RustFS) from the container.  
> You can also create the bucket from there.

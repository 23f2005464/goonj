# 🎉 Goonj 2026 — Grand Cultural Festival System

A full-stack festival management system with:
- **Registration website** with festival theme
- **Email QR code passes** sent on registration
- **Past performances showcase**
- **QR Scanner** for event-day entry verification
- **Admin dashboard** with full CRUD + attendance tracking

---

## 📁 Folder Structure

```
goonj2026/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # App entry point
│   ├── seed.py                 # Sample performances data
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   ├── database.py         # SQLAlchemy models + DB setup
│   │   └── schemas.py          # Pydantic request/response schemas
│   ├── routes/
│   │   ├── registrations.py    # Registration + QR verify endpoints
│   │   ├── admin.py            # Admin CRUD endpoints (JWT protected)
│   │   └── performances.py     # Public performances endpoint
│   ├── utils/
│   │   ├── qr_utils.py         # QR code generation
│   │   ├── email_utils.py      # Email with QR code
│   │   └── auth.py             # JWT authentication
│   └── static/
│       └── qrcodes/            # Generated QR images (auto-created)
│
└── frontend/                   # React + Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx            # Router + app entry
        ├── index.css           # Global styles + CSS variables
        ├── utils/api.js        # Axios instance (dynamic base URL)
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── HomePage.jsx        # Hero + countdown + highlights
            ├── RegisterPage.jsx    # Registration form
            ├── PerformancesPage.jsx # Past performances with filters
            ├── QRScannerPage.jsx   # Camera + manual QR scanner
            ├── AdminLoginPage.jsx  # Admin login
            └── AdminDashboard.jsx  # Full admin dashboard
```

---

## 🚀 Setup & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

---

### 1️⃣ Backend Setup

```bash
cd goonj2026/backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your values (see below)

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

---

### 2️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd goonj2026/frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Run dev server
npm run dev
```

Frontend will be running at: **http://localhost:5173**

---

### 3️⃣ Environment Configuration

Edit `backend/.env`:

```env
DATABASE_URL=sqlite:///./goonj2026.db
SECRET_KEY=make-this-very-long-and-random-12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=goonj2026admin

# Email (optional - skip if you don't need email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=Goonj 2026
```

**For Gmail:** Go to Google Account → Security → App Passwords → Create app password

---

## 🌐 Using with ngrok (Public URL)

To expose your app publicly with ngrok:

### Step 1: Start backend with ngrok

```bash
# Terminal 1: Start backend
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2: Expose backend
ngrok http 8000
# Copy the URL, e.g.: https://abc123.ngrok-free.app
```

### Step 2: Update frontend .env.local

```env
VITE_API_URL=https://abc123.ngrok-free.app
```

### Step 3: Rebuild and expose frontend

```bash
# Terminal 3: Build frontend
cd frontend
npm run build

# Serve built files
npx serve dist -p 5173

# Terminal 4: Expose frontend
ngrok http 5173
```

> **Note:** The backend has `allow_origins=["*"]` so any ngrok URL works without changes.

---

## 🔑 Pages & URLs

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Festival landing page with countdown |
| Register | `/register` | Registration form → gets QR via email |
| Performances | `/performances` | Past performances showcase |
| QR Scanner | `/scanner` | Event day entry verification |
| Admin Login | `/admin/login` | Admin portal login |
| Admin Dashboard | `/admin/dashboard` | Full CRUD + attendance |

---

## 🔐 Admin Credentials

Default (change in `.env`):
- **Username:** `admin`
- **Password:** `goonj2026admin`

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/registrations/` | New registration → sends QR email |
| `POST` | `/api/registrations/verify-qr` | Verify QR + mark attendance |
| `GET` | `/api/performances/` | Public performances list |
| `POST` | `/api/admin/login` | Admin login → JWT token |
| `GET` | `/api/admin/stats` | Dashboard stats |
| `GET` | `/api/admin/registrations` | All registrations (+ search) |
| `PUT` | `/api/admin/registrations/:id` | Update registration |
| `DELETE` | `/api/admin/registrations/:id` | Delete registration |
| `PATCH` | `/api/admin/registrations/:id/attendance` | Toggle attendance |
| `POST` | `/api/admin/performances` | Add performance |
| `PUT` | `/api/admin/performances/:id` | Update performance |
| `DELETE` | `/api/admin/performances/:id` | Delete performance |

---

## 📱 QR Scanner Notes

The scanner page (`/scanner`) has two modes:
1. **Camera Scan** — Uses device camera to scan QR codes. Works best on mobile on event day.
2. **Manual Entry** — Paste/type the QR token for desktop verification.

On successful scan:
- Marks attendee as `present` in database
- Shows attendee name, college, department
- Prevents duplicate check-in (shows "already checked in")

---

## 🏗️ Production Build

```bash
cd frontend
npm run build
# Output in frontend/dist/ — serve with nginx or any static host
```

For backend, use gunicorn:
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

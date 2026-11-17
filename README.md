# CampusCare - Campus Complaint & Issue Management System

CampusCare enables students to submit and track campus complaints while administrators can review, filter, and resolve them.

## Live deployment

The application is live at [CampusCare on Render](https://capstone-web-dev-3.onrender.com/).

## Technology

HTML, CSS, vanilla JavaScript, Node.js, Express, MongoDB/Mongoose, JWT, and bcryptjs.

## Run locally

1. Create the local environment file: `Copy-Item .env.example .env`
2. Edit `.env` with your MongoDB URI and a long JWT secret.
3. Install packages: `npm install`
4. Start the application: `npm run dev`
5. Open `http://localhost:3000`; verify `http://localhost:3000/api/health` returns JSON.

## Main API routes

| Route | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/register` | Public | Register a student |
| `POST /api/auth/login` | Public | Login and receive a JWT |
| `GET /api/complaints` | Student/Admin | Role-aware complaint list |
| `POST /api/complaints` | Student | Submit a complaint |
| `PATCH /api/complaints/:id/status` | Admin | Update status and remark |
| `GET /api/complaints/stats` | Admin | Dashboard counts |

Public registration never creates administrators. Create a demo admin account securely with PowerShell:

```powershell
$env:ADMIN_NAME='Campus Admin'; $env:ADMIN_EMAIL='admin@example.com'; $env:ADMIN_PASSWORD='a-long-demo-password'; npm run seed:admin
```

## Deployment

CampusCare is deployed as a Node.js/Express Web Service on Render. MongoDB Atlas provides the hosted database.

The Render service uses these environment variables, configured in Render rather than committed to this repository:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN=1d
NODE_ENV=production
```

For the hosted service to access MongoDB Atlas, Atlas Network Access must allow the Render deployment. The database connection string and JWT secret are never committed to GitHub.

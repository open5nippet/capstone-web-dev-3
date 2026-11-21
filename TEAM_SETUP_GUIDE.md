# CampusCare - Team Setup Guide

Use this guide to run CampusCare from GitHub on another laptop.

> Do not use Live Server. CampusCare runs through Node.js and Express.

## 1. Install required software

Install:

- [Node.js](https://nodejs.org/) LTS
- [Git](https://git-scm.com/)
- Visual Studio Code

Open a VS Code terminal and verify the installation:

```powershell
node -v
npm -v
git --version
```

## 2. Clone the project

Open VS Code, choose **Terminal > New Terminal**, and run:

```powershell
cd Desktop
git clone https://github.com/open5nippet/capstone-web-dev-3.git
cd capstone-web-dev-3
code .
```

If `code .` does not work, open VS Code manually and choose **File > Open Folder**, then select the `capstone-web-dev-3` folder.

## 3. Install packages

Inside the project folder terminal, run:

```powershell
npm install
```

## 4. Create the local environment file

Run:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set these values:

```env
PORT=3000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=any_long_private_random_text_here
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

For a teammate using the shared MongoDB Atlas database:

- Send the MongoDB connection string/password privately, never through GitHub or a public group.
- In MongoDB Atlas, open **Network Access** and add the teammate's current IP address.
- If the `mongodb+srv://` connection string gives a DNS error, use the Atlas **Legacy URI String** (`mongodb://...`) instead.

## 5. Start the project

Run:

```powershell
npm run dev
```

A successful startup shows:

```text
Connected to MongoDB
CampusCare is running at http://localhost:3000
```

Open the application at:

```text
http://localhost:3000
```

You can verify the backend at:

```text
http://localhost:3000/api/health
```

## 6. Test as a student

1. Open `http://localhost:3000`.
2. Click **Register**.
3. Create a student account.
4. Sign in.
5. Submit a complaint.
6. Confirm it appears on the student dashboard.

## 7. Create an admin account if needed

Open a second terminal in the same project folder and run:

```powershell
$env:ADMIN_NAME="Campus Admin"
$env:ADMIN_EMAIL="admin@campuscare.local"
$env:ADMIN_PASSWORD="ChooseAStrongPassword123"
npm run seed:admin
```

Then select **Admin Login** on the website and sign in with that email and password.

## 8. Git workflow for team members

Before starting work:

```powershell
git pull origin main
git checkout -b feature/your-name-task
```

After making changes:

```powershell
git add .
git commit -m "feat: describe your change"
git push -u origin feature/your-name-task
```

Create a Pull Request on GitHub for review instead of directly changing `main`.

## Security rules

Never upload or share:

- `.env`
- MongoDB passwords or connection strings
- JWT secrets
- `node_modules`

The `.gitignore` file is configured to exclude these files from Git.

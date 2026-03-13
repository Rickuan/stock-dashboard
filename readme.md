# Stock Dashboard

This is a stock dashboard project built using a separated frontend-backend architecture. The frontend is built with React (Vite) + TypeScript, and the backend utilizes Python (FastAPI) and an SQLite database.

Below are instructions on how to clone the project to your local machine, install dependencies, compile, run, and clean up the environment.

---

## 1. Get the Project (Clone)

Open your terminal (Command Prompt / PowerShell / Terminal) and run the following commands to clone the project to your computer:

```bash
git clone https://github.com/YourProjectURL/stock-dashboard.git
cd stock-dashboard
```

*(Note: If you already have the source code downloaded, please skip to step 2)*

---

## 2. Install Dependencies & Environment Setup

This system is divided into `frontend` and `backend`, which need to be configured separately.

### Backend (Python Environment)

Please ensure you have Python installed (version 3.9 or newer is recommended).

```bash
# Go to the backend directory
cd backend

# Create a virtual environment to isolate project dependencies
python -m venv venv

# Activate the virtual environment (Windows PowerShell)
.\venv\Scripts\activate
# If you are on Mac/Linux, the command is: source venv/bin/activate

# Install the required backend dependencies
pip install -r requirements.txt

# Return to the root directory for the next step
cd ..
```

### Frontend (Node.js Environment)

Please ensure you have Node.js and Yarn installed.

```bash
# Go to the frontend directory
cd frontend

# Install the required frontend dependencies using Yarn (based on package.json & yarn.lock)
yarn install

# Return to the root directory
cd ..
```

---

## 3. Start the Servers (Compile & Run)

When developing locally, you will need two open terminal windows to start both the backend and frontend services.

### Step 3-1: Start the Backend Service

Open a new terminal window:

```bash
cd backend

# Ensure the virtual environment is activated (Windows example)
.\venv\Scripts\activate

# Start the FastAPI server (runs on http://127.0.0.1:8000 by default)
uvicorn main:app --reload
```

### Step 3-2: Start the Frontend Service

Open another new terminal window:

```bash
cd frontend

# Start the Vite development server (displays a local test URL, usually http://localhost:5173)
yarn dev
```

> **Tip:** Open your browser and navigate to the URL provided in the terminal (e.g., `http://localhost:5173`) to view the web application.

---

## 4. Delete & Cleanup the Environment

If you need to free up disk space or remove all installed dependencies, run the following commands from the **project root folder**:

### Windows (using Command Prompt or PowerShell)

```powershell
# Remove frontend's node_modules folder
rmdir /s /q frontend\node_modules

# Remove backend's virtual environment folder
rmdir /s /q backend\venv

# You can also remove auto-generated cache folders
rmdir /s /q backend\__pycache__
rmdir /s /q frontend\dist
```

### Mac / Linux (using Terminal)

```bash
rm -rf frontend/node_modules
rm -rf backend/venv
rm -rf backend/__pycache__
rm -rf frontend/dist
```

*(Note: If you want to delete the entire project entirely, just delete the `stock-dashboard` folder.)*

---

## 5. Security Notes ⚠️

1. **CORS Configuration (Cross-Origin Resource Sharing)**:
   Currently, in `backend/main.py`, the setting `allow_origins(["*"])` allows API access from all origins. **This is intended only for the development stage.** Before deploying to production, ensure you update this to only allow specific frontend domains to prevent Cross-Site Request Forgery (CSRF) attacks.
2. **Authentication**:
   The current `POST /api/login` route uses a hardcoded username (`admin`) and password (`000`) to mock future authorization. Before going live, it is imperative to implement robust password encryption, real database authentication, and a secure JWT Token generation strategy.
3. **Sensitive Information Should Not Be Committed**:
   Any API keys (within `.env` files), passwords, or production database configurations should not be committed to Git. Ensure your `.gitignore` correctly ignores these files.
4. **Database Files**:
   This system currently utilizes SQLite (`backend/stock-dashboard.db`). Pay close attention to the write permissions of this folder/file. If deploying to a public-facing server, do not store it in a directory where a web server (like Nginx static directories) can serve/download it directly.

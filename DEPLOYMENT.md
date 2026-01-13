# Deploying EliteShop

This project is a **Full Stack Application** consisting of:

1.  **Frontend**: React (Vite)
2.  **Backend**: FastAPI (Python)
3.  **Database**: MySQL

## ⚠️ Important Note on GitHub Deployment

**GitHub Pages** (and GitHub itself) **ONLY** static frontend websites. It **CANNOT** host Python backends or MySQL databases.

Therefore, "Deploying through GitHub" implies a two-part strategy:

1.  **Frontend**: Deployed to **GitHub Pages** (automated via GitHub Actions).
2.  **Backend & Database**: Must be deployed to a cloud provider like **Render**, **Railway**, or **AWS**.

---

## Part 1: Frontend Deployment (GitHub Pages)

I have already configured the repository for automated frontend deployment.

### How to Activate:
1.  Go to your Repository Settings on GitHub.
2.  Navigate to **Pages** (sidebar).
3.  Under "Build and deployment", select **Source** -> **GitHub Actions**.
4.  The action named `Deploy Static Content to Pages` (which I created in `.github/workflows/deploy.yml`) will automatically run on every push to `main`.
5.  Your site will be live at: `https://quantumNexus0.github.io/EliteShop/`

**Note**: Since the backend is not running on GitHub, features like Login, Products, and Reviews will NOT work on the GitHub Pages URL until you link it to a live backend.

---

## Part 2: Backend Deployment (Render.com Recommended)

To get the backend running for free (or cheap), **Render** is recommended as it integrates directly with your GitHub repository.

### Steps:
1.  **Sign up** at [render.com](https://render.com) using your GitHub account.
2.  **Create a Web Service**:
    *   Connect your `EliteShop` repo.
    *   **Root Directory**: `backend_fastapi`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Environment Variables**: Add your `SECRET_KEY`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `SMTP_USER`, etc.
3.  **Create a MySQL Database**:
    *   Render offers managed MySQL (or use PlanetScale/Aiven for free tier).
    *   Update the `DB_HOST` in your Web Service to point to this new database.

### Linking Frontend to Live Backend
Once your backend is live (e.g., `https://eliteshop-api.onrender.com`):
1.  Open `src/services/api.ts`.
2.  Update `API_URL` to point to your new backend URL instead of `localhost`.
3.  Push the change to GitHub.
4.  The GitHub Action will automatically redeploy the Frontend to use the live backend!

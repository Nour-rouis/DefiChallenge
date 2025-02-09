# DefiChallenge
# BY TIME TO FIX Team

# Project Title

A brief description of what your project does and its main features.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Project Structure

```
project-root/
│-- backend/  # Flask backend
│   │-- __pycache__/
│   │-- .venv/
│   │-- dao/
│   │   │-- __pycache__/
│   │   │-- analysedao.py
│   │   │-- erreurdao.py
│   │   │-- experiencedao.py
│   │   │-- kpiCalculater.py
│   │   │-- operateurdao.py
│   │   │-- raquettedao.py
│   │   │-- tachedao.py
│   │-- images/
│   │   │-- exp1/
│   │       │-- 1_Raquette-01.png
│   │     
│   │-- sql/
│   │   │-- base.db
│   │   │-- base.sql
│   │   │-- Looping defi challenge.jpg
│   │   │-- Looping defi challenge.loo
│   │-- .gitignore
│   │-- connexion.py
│   │-- index.py
│   │-- requirements.txt
│-- frontend/  # React frontend
│   │-- node_modules/
│   │-- public/
│   │-- src/
│   │   │-- assets/
│   │   │   │-- images/
│   │   │-- components/
│   │   │   │-- CustomDataGrid.js
│   │   │   │-- CustomModal.js
│   │   │   │-- ErreurListe.js
│   │   │   │-- ExperienceList.js
│   │   │   │-- Navbar.js
│   │   │   │-- OperatorList.js
│   │   │   │-- RaquetteListe.js
│   │   │   │-- useHandleActions.js
│   │   │   │-- UserList.js
│   │   │-- pages/
│   │   │   │-- ConfigTache.js
│   │   │   │-- Experience.js
│   │   │   │-- GestionExperience.js
│   │   │   │-- Home.js
│   │   │   │-- KpiPage.js
│   │   │   │-- Users.js
│   │   │-- routes/
│   │   │   │-- appRouter.js
│   │   │-- styles/
│   │   │-- utils/
│   │   │   │-- erreurApi.js
│   │   │   │-- experienceApi.js
│   │   │   │-- kpiApi.js
│   │   │   │-- RaquetteApi.js
│   │   │   │-- tacheApi.js
│   │   │-- index.css
│   │-- package.json
│-- README.md
```

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Python 3.x installed
- Node.js and npm installed

## Backend Setup

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install `virtualenv`:
   ```sh
   pip install virtualenv
   ```
3. Create and activate a virtual environment:
   ```sh
   python -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Run the Flask app:
   ```sh
   flask --app index run
   ```
   The backend should now be running on `http://127.0.0.1:5000/`.

## Frontend Setup

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
   The frontend should now be running on `http://localhost:3000/`.

## Usage

Once both the backend and frontend are running, open `http://localhost:3000/` in your browser to interact with the application.

## Technologies Used

- **Backend:** Flask, Python
- **Frontend:** ReactJS, JavaScript

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are welcome.




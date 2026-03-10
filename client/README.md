# 📚 Study Planner

A full-stack study planner with Task Manager, Subject Tracker, and Study Schedule Calendar.

## Tech Stack
- **Frontend**: React + Vite, vanilla CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose

## Project Structure
```
study-planner/
├── server/           # Node.js + Express backend
│   ├── models/       # Mongoose models (Task, Subject, Schedule)
│   ├── routes/       # Express routes
│   └── index.js      # Entry point
└── client/           # React frontend (Vite)
    └── src/
        ├── pages/    # Dashboard, Tasks, Subjects, Schedule
        ├── api/      # Axios API helpers
        └── App.jsx
```

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running locally, or use MongoDB Atlas.

### 2. Backend
```bash
cd server
cp .env.example .env       # edit MONGO_URI if needed
npm install
npm run dev                # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev                # runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /api/tasks         | Get all tasks      |
| POST   | /api/tasks         | Create task        |
| PUT    | /api/tasks/:id     | Update task        |
| DELETE | /api/tasks/:id     | Delete task        |
| GET    | /api/subjects      | Get all subjects   |
| POST   | /api/subjects      | Create subject     |
| PUT    | /api/subjects/:id  | Update subject     |
| DELETE | /api/subjects/:id  | Delete subject     |
| GET    | /api/schedule      | Get all sessions   |
| POST   | /api/schedule      | Create session     |
| PUT    | /api/schedule/:id  | Update session     |
| DELETE | /api/schedule/:id  | Delete session     |

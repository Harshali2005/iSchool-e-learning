# MERN E-Learning Starter

This is a starter MERN (MongoDB, Express, React, Node) e-learning project with:
- Separate User and Admin dashboards
- JWT authentication
- Users can enroll in courses and track lesson progress
- Admin can add/delete courses and view users
- Tailwind CSS for styling
- Seed script that creates 5 courses × 5 lessons and admin/user accounts

## Setup (locally)

### Backend
1. Open a terminal and go to `backend/`
2. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
3. Install dependencies:
```bash
cd backend
npm install
```
4. Seed the database:
```bash
npm run seed
```
5. Start server:
```bash
npm run dev
# or
npm start
```

### Frontend
1. Open a terminal and go to `frontend/`
2. Install dependencies:
```bash
cd frontend
npm install
```
3. Start dev server:
```bash
npm run dev
```

Frontend defaults to API URL `http://localhost:5000/api`. You can change it by setting `VITE_API_URL`.

### Seeded accounts
- Admin: admin@example.com / Admin@123
- User: user@example.com / User@123


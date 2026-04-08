💰 SpendWise – Personal Expense Tracker & Smart Analytics
SpendWise is a premium full-stack expense management application where users can track daily spending, visualize financial health through interactive charts, and get smart AI-driven insights. The project is built with a real-world production setup using separate deployments for frontend and backend API.

Live Project Links
User Frontend:
https://spendwise-beta-cyan.vercel.app

Note: The backend is hosted on Render Free Tier, so the first request may take 30–60 seconds due to cold start.

Project Structure
Spendwise
├── frontend (User React App – Vite)
└── server (Node.js + Express API)

Tech Stack
Frontend: React, Vite, Tailwind CSS 4.0, Recharts, Framer Motion
Backend: Node.js, Express.js
Database: MongoDB Atlas
Authentication: JWT (token-based)
Deployment: Vercel (Frontend), Render (Backend)

Features
User Features:
- Professional Glassmorphism UI
- Dashboard with Smart Insights
- Add, Edit, and Delete Expenses
- Monthly & Yearly Expense Analytics (Interactive Charts)
- Category-based advanced filtering
- Real-time search by title or notes
- Responsive design (Mobile & Desktop)
- Secure User Authentication

Local Setup (Run on Another Device)
Prerequisites:
- Node.js (v18 or above)
- npm or yarn
- MongoDB Atlas account

Step 1: Clone the Repository
git clone https://github.com/rayyanqureshi0123/Spendwise.git
cd Spendwise

Step 2: Backend Setup
cd server
npm install

Create a file server/.env with the following content:
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

Start the backend server:
npm run dev

Backend will run at:
http://localhost:5000

Step 3: Frontend Setup
cd ../frontend
npm install

Start frontend:
npm run dev

Frontend will run at:
http://localhost:5173

Authentication Details
- JWT based authentication
- Tokens passed via Authorization headers
- Secure password hashing with bcryptjs
- Protected API routes

Deployment Notes
- Frontend is deployed on Vercel
- Backend is deployed on Render
- SPA routing handled using Vercel rewrite rules
- CORS configured for specific frontend domains
- Backend may experience cold start delay on inactivity

Known Limitations
- Render free tier cold start delay
- Limited to single-currency (₹) for now

Future Improvements
- Multi-currency support
- Budget limit alerts
- Recurring expense automation
- Receipt image upload

Author
Mohammed Rayyan Qureshi - Full-Stack Developer
India

If you like this project, feel free to star the repository and explore the live demo.

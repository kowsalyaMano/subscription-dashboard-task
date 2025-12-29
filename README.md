# Subscription Management Dashboard

This repository contains a minimal subscription management dashboard demo.

Folders:
- `server` - Express + Prisma backend (PostgresQl for local dev)
- `client` - React + Vite frontend


for admin: email: admin@example.com
password: admin123

1. Clone the repository
git clone https://github.com/your-username/subscription-dashboard-task.git
cd subscription-dashboard-task

2. Backend Setup
cd server
npm install


Create a .env file in the server folder:

PORT=4000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"


Run database migrations / seed:

npx prisma migrate dev
npx prisma db seed


Start the backend server:

npm run dev


3. Frontend Setup
cd client
npm install
npm run dev

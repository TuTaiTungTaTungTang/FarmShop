# Farm shop Setup Guide

## 📋 Prerequisites

- Node.js (v18.16.0 or higher)
- MongoDB (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone <your-repo-url>
cd farm shop
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file from template
cp config/.env.example config/.env
# Edit config/.env with your actual values

# Start backend server
npm run dev
# Server runs on http://localhost:8000
```

### 3. Socket Server Setup

```bash
cd ../socket
npm install

# Create .env file from template
cp .env.example .env
# Edit .env with your values

# Start socket server
npm start
# Socket server runs on http://localhost:4000
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install

# Start frontend
npm start
# Frontend runs on http://localhost:3000
```

## 🔧 Environment Configuration

### Backend (.env)

See `backend/config/.env.example` for all required variables:

**Required:**

- `DB_URL`: MongoDB connection string
- `JWT_SECRET_KEY`: JWT signing key
- `SMTP_*`: Email configuration for notifications

**Optional:**

- `STRIPE_*`: For payment processing
- `CLOUDINARY_*`: For image uploads

### Socket (.env)

See `socket/.env.example`:

- `PORT`: Socket server port (default: 4000)

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /your/db/path

# Use connection string:
DB_URL=mongodb://localhost:27017/your-database-name
```

### Option 2: MongoDB Atlas

```bash
# Create cluster at https://cloud.mongodb.com
# Get connection string:
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

### Seed Initial Data

```bash
cd backend
node seeds/seedData.js
```

## 📧 Email Setup (Gmail Example)

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password
3. Configure in .env:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 💳 Payment Setup (Optional)

### Stripe

1. Create account at https://stripe.com
2. Get API keys from dashboard
3. Add to .env:

```
STRIPE_API_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### PayPal

- Configure in frontend for PayPal integration

## 🖼️ Image Upload Setup (Optional)

### Cloudinary

1. Create account at https://cloudinary.com
2. Get credentials from dashboard
3. Add to .env:

```
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Socket
cd socket && npm start

# Terminal 3 - Frontend
cd frontend && npm start
```

### Production Mode

```bash
# Backend
cd backend && npm start

# Socket
cd socket && npm start

# Frontend (build first)
cd frontend
npm run build
# Deploy build folder to web server
```

## 🔍 Testing the Setup

1. **Frontend**: Visit http://localhost:3000
2. **Backend API**: Visit http://localhost:8000/test
3. **Socket**: Check browser console for socket connection

## 🔁 CI/CD And Branch Protection

### GitHub Actions CI (already configured)

This repo includes CI workflow:

- `.github/workflows/ci.yml`

What it runs on `push` and `pull_request` to `master`:

- Backend tests (Node 18 and Node 20)
- Frontend tests (Node 18 and Node 20)
- Frontend production build (Node 18 and Node 20)
- Backend coverage artifact upload

### Enforce "CI must pass" before merge

In GitHub repository settings:

1. Go to `Settings` > `Branches`
2. Click `Add branch protection rule`
3. Branch name pattern: `master`
4. Enable `Require a pull request before merging`
5. Enable `Require status checks to pass before merging`
6. Select all checks from workflow `CI`
7. (Recommended) Enable `Require branches to be up to date before merging`
8. Save changes

After this, PRs cannot be merged when CI fails.

### View CI Results

1. Open repository tab `Actions`
2. Open latest workflow run `CI`
3. Check jobs:
   - `Backend Tests (Node 18/20)`
   - `Frontend Tests & Build (Node 18/20)`

### Download Coverage Artifact

1. Open a successful CI run
2. In `Artifacts`, download:
   - `backend-coverage-node-18`
   - `backend-coverage-node-20`

## 📱 Features Available

- ✅ User registration/login
- ✅farm shop management
- ✅ Product catalog with categories
- ✅ Shopping cart & checkout
- ✅ Order management
- ✅ Real-time chat system
- ✅ Event/sale management
- ✅ Coupon system
- ✅ Payment integration (Stripe/PayPal)
- ✅ Admin dashboard
- ✅ Withdrawal system for sellers

## ❗ Common Issues

### Port Conflicts

- Change PORT in .env files if ports are occupied

### MongoDB Connection

- Ensure MongoDB is running
- Check connection string format
- Whitelist IP in MongoDB Atlas

### Email Not Working

- Use App Password for Gmail
- Check SMTP settings
- Verify email credentials

### Payment Issues

- Verify Stripe API keys
- Check webhook configuration
- Test in Stripe test mode first

## 🆘 Need Help?

- Check console logs for errors
- Verify all .env variables are set
- Ensure all services are running
- Check database connectivity

## 📚 Project Structure

```
├── backend/          # Node.js API server
├── frontend/         # React.js application
├── socket/           # Socket.io server
└── README.md         # This file
```

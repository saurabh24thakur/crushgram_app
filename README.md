# CrushGram

A scalable social media application built with the MERN stack (MongoDB, Express, React, Node.js), featuring real-time messaging, user profiles, and post interactions.

## 🚀 Features

-   **Real-time Messaging**: Instant chat using Socket.io.
-   **Scalable Architecture**: Integrated **Redis** for handling 500+ concurrent connections and horizontal scaling.
-   **Hybrid Socket Mode**: Automatically falls back to in-memory storage if Redis is not available (dev-friendly).
-   **Optimized Performance**: Database indexing and efficient query patterns for low latency.
-   **Media Sharing**: Image and video uploads via Cloudinary.
-   **Social Graph**: Follow/Unfollow system with real-time notifications.

## 🛠️ Tech Stack

-   **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite
-   **Backend**: Node.js, Express.js, Socket.io
-   **Database**: MongoDB (Mongoose)
-   **Caching/PubSub**: Redis (optional but recommended for production)
-   **Storage**: Cloudinary

## ⚙️ Setup & Installation

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas)
-   Redis (Optional, for scalability)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=redis://localhost:6379  # Optional
```

Start the server:
```bash
npm run dev
```
*Note: If Redis is not running, the server will start in "Fallback Mode" using in-memory storage.*

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Update `frontend/src/config.js` if your backend port differs from 3000:
```javascript
export const serverURL = "http://localhost:3000";
```

**For Production:**
Create a `.env` file in `frontend/` and add:
```env
VITE_SERVER_URL=https://api.procoder.dpdns.org
```

Start the frontend:
```bash
npm run dev
```

## 📈 Scalability & Testing

This project includes load testing scripts to verify performance.

### Running Load Tests
Navigate to the backend directory:
```bash
cd backend
```

**1. Socket Scalability Test**
Simulates 100 concurrent user connections.
```bash
node tests/socket_load_test.js
```

**2. API Latency Test**
Measures API throughput and response time.
```bash
node tests/api_load_test.js
```

## 📂 Project Structure

-   `backend/config/redis.js`: Redis client configuration with fault tolerance.
-   `backend/socket.js`: Socket.io setup with Redis Adapter and fallback logic.
-   `backend/models/`: Mongoose schemas with optimized indexes.

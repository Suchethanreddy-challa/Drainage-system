# 🌊 Smart Drainage Management System

A full-stack web application that enables citizens to report drainage issues, track complaint status in real time, and allows administrators to manage and resolve complaints efficiently.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)
![Tech Stack](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens)

---

## 📸 Features

### 👤 Citizens
- 📝 **Report Issues** — Submit drainage complaints with location, description & photo uploads
- 🔍 **Track Complaints** — Real-time status tracking using a unique complaint ID
- 🗺️ **Map View** — View reported issues on an interactive map
- 👤 **Profile Management** — View and manage personal complaint history
- 🌐 **Multi-language Support** — Bilingual interface support
- 🌙 **Dark / Light Mode** — Theme toggle for accessibility

### 🔧 Administrators
- 📊 **Admin Dashboard** — Overview of all complaints with stats and filters
- ✅ **Status Management** — Update complaint status (Pending → In Progress → Resolved)
- 🔎 **Search & Filter** — Filter by area, status, priority, and date
- 📧 **Email Notifications** — Automated email updates sent to citizens on status change
- 🔐 **Secure Admin Login** — JWT-protected admin routes

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS      |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB, Mongoose                 |
| Auth        | JWT (JSON Web Tokens)             |
| Email       | Nodemailer (Gmail SMTP)           |
| File Upload | Multer                            |
| State Mgmt  | React Context API                 |

---

## 📁 Project Structure

```
smart-drainage-system/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth, Theme, Language context
│   │   └── services/        # API service layer
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── config/              # Database config
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth & upload middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Email & helper utilities
│   ├── seed.js              # Database seeder
│   └── server.js            # Entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Gmail account (for email notifications)

### 1. Clone the Repository

```bash
git clone https://github.com/Suchethanreddy-challa/Drainage-system.git
cd Drainage-system
```

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-drainage
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@smartdrainage.gov
```

Start the server:

```bash
npm start
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

### 4. Seed the Database (Optional)

```bash
cd server
node seed.js
```

---

## 🌐 Running the App

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:3000         |
| Backend API| http://localhost:5000/api     |
| Health Check | http://localhost:5000/api/health |

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/auth/register`  | Register new user   |
| POST   | `/api/auth/login`     | User login          |
| GET    | `/api/auth/me`        | Get current user    |

### Complaints
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/complaints`           | Submit a new complaint   |
| GET    | `/api/complaints`           | Get all complaints       |
| GET    | `/api/complaints/:id`       | Get complaint by ID      |
| GET    | `/api/complaints/track/:id` | Track by complaint ID    |

### Admin
| Method | Endpoint                        | Description            |
|--------|---------------------------------|------------------------|
| GET    | `/api/admin/complaints`         | Get all complaints     |
| PUT    | `/api/admin/complaints/:id`     | Update complaint status|
| GET    | `/api/admin/stats`              | Dashboard statistics   |

---

## 📧 Email Notifications

The system sends automated email notifications to citizens when:
- ✅ Their complaint is received
- 🔄 Status is updated to **In Progress**
- ✔️ Complaint is marked as **Resolved**

---

## 👨‍💻 Author

**Suchethan Reddy Challa**  
GitHub: [@Suchethanreddy-challa](https://github.com/Suchethanreddy-challa)

---

## 📄 License

This project is licensed under the **MIT License**.

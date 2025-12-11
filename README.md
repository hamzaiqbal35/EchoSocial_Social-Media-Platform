<div align="center">
  <img src="client/public/Logo.png" alt="EchoSocial Logo" width="120" />
  <h1>🚀 EchoSocial</h1>
  <p><strong>A Next-Generation Social Media Platform</strong></p>
  <p>Connect, Share, and Inspire with a modern, feature-rich social experience.</p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-api-endpoints">API</a> •
    <a href="#-license">License</a>
  </p>

  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
  ![React](https://img.shields.io/badge/react-v19.0.0-61dafb.svg)
  ![Status](https://img.shields.io/badge/status-active-success.svg)
</div>

<br />

## 📖 Overview

**EchoSocial** is a full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). It features a stunning modern UI with dark mode, glassmorphism effects, and smooth animations, providing a seamless user experience. Designed for scalability and performance, EchoSocial brings people together.

---

## ✨ Features

### 🌟 Core Experience
- **🔐 Secure Authentication**: Robust JWT-based auth with bcrypt password hashing.
- **bust User Profiles**: Fully customizable profiles with avatars, bios, and social stats.
- **📱 Rich Media Posts**: Create posts with text, images, and **video playback** support.
- **❤️ Interactive Engagement**: Like and comment system with real-time updates.
- **🤝 Social Graph**: Follow/unfollow system to curate your personalized feed.

### 🚀 Advanced Capabilities
- **📡 Personalized Feed**: Smart feed algorithm showing content from users you follow.
- **🔔 Real-time Notifications**: Stay updated with instant alerts for interactions.
- **🛡️ Admin Dashboard**: Comprehensive control panel to manage users, posts, and reports.
- **🚫 Safety Tools**: Blocking and reporting systems to ensure a safe community.
- **🔍 Search**: Find friends and content creators easily.

### 🎨 UI/UX Excellence
- **🌙 Dark Theme**: Sleek, eye-friendly dark mode with vibrant gradients.
- **💎 Glassmorphism**: Modern frosted glass aesthetics.
- **⚡ Responsive**: Mobile-first design that looks great on any device.

---

## 🛠️ Tech Stack

<div align="center">

| **Category** | **Technologies** |
|:------------:|:-----------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 6, Axios |
| **Backend** | Node.js, Express 5, Mongoose 9, JWT, Bcrypt |
| **Database** | MongoDB (Local / Atlas) |
| **Tools** | ESDoc, Postman, Git, NPM |

</div>

---

## 📦 Installation

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/hamzaiqbal35/ApexcifyTechnologys_Social-Media-Platform.git
cd EchoSocial
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echosocial
JWT_SECRET=your_super_secret_key_change_me
NODE_ENV=development
```

*(Optional) Seed the database with an admin user:*
```bash
npm run seed:admin
```

Start the backend server:
```bash
npm run dev
```
> Server runs on `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```
> Client runs on `http://localhost:5173`

---

## 🌐 API Endpoints

Here are the main API routes available.

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| **Auth** | | | |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/me` | Get current user info | ✅ |
| **Users** | | | |
| `GET` | `/api/users/:id` | Get user profile | ❌ |
| `PUT` | `/api/users/profile` | Update profile | ✅ |
| `POST` | `/api/users/:id/follow` | Follow a user | ✅ |
| **Posts** | | | |
| `GET` | `/api/posts` | Get all posts | ❌ |
| `POST` | `/api/posts` | Create a post | ✅ |
| `PUT` | `/api/posts/:id` | Update a post | ✅ |
| `DELETE` | `/api/posts/:id` | Delete a post | ✅ |
| **Feed** | | | |
| `GET` | `/api/feed` | Get personalized feed | ✅ |

---

## 📁 Project Structure

```
EchoSocial/
├── client/                 # Frontend React App
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Full page views
│       ├── contexts/       # State management
│       └── services/       # API integration
│
├── server/                 # Backend Node.js App
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API route definitions
│   │   └── middleware/     # Auth & error handling
│
└── README.md               # Project Documentation
```

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <p>Built with ❤️ by <strong>Hamza Iqbal</strong></p>
  <p>
    <a href="https://github.com/hamzaiqbal35">GitHub</a> •
    <a href="mailto:hamzaiqbalrajpoot35@gmail.com">Contact</a>
  </p>
</div>

<div align="center">
  <img src="client/public/ES.svg" alt="EchoSocial Logo" width="72" />
  <h1>EchoSocial</h1>
  <p>Full-stack social media platform built with the MERN stack (MongoDB, Express 5, React 19, Node.js).</p>

  <p>
    <a href="#overview">Overview</a> &bull;
    <a href="#features">Features</a> &bull;
    <a href="#tech-stack">Tech Stack</a> &bull;
    <a href="#project-structure">Project Structure</a> &bull;
    <a href="#getting-started">Getting Started</a> &bull;
    <a href="#api-reference">API Reference</a> &bull;
    <a href="#license">License</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
    <img src="https://img.shields.io/badge/react-19.2.1-61dafb.svg" alt="React 19.2.1" />
    <img src="https://img.shields.io/badge/vite-7.2.4-646cff.svg" alt="Vite 7.2.4" />
    <img src="https://img.shields.io/badge/express-5.1.0-000000.svg" alt="Express 5.1.0" />
    <img src="https://img.shields.io/badge/mongoose-9.0.0-880000.svg" alt="Mongoose 9.0.0" />
  </p>
</div>

---

## Overview

EchoSocial is a full-stack social media application providing a chronological feed, multi-file media publishing, user connections, notifications, content reporting, and an administrative moderation dashboard. The backend exposes a RESTful API with JWT authentication and local multipart file storage, paired with a React single-page client supporting persistent dark and light themes.

---

## Features

### Authentication and Account Management
- **JWT Authentication**: Registration and login backed by bcrypt password hashing and 30-day JSON Web Tokens.
- **Password Recovery**: Forgot-password and reset-password workflow using SHA-256 hashed tokens with a 10-minute expiration window delivered via SMTP email.
- **Account Controls**: Profile editing (bio, avatar, account details), in-app password changes, and password-verified account deletion.

### Feed and Social Graph
- **Chronological Feed**: Paginated feed ordered from newest to oldest, automatically excluding posts from users you have blocked or who have blocked you.
- **Follow System**: Follow and unfollow users with follower/following lists and a People directory featuring suggested users.
- **Search**: Search endpoints and UI for finding users by username/profile and posts by content.

### Posts and Media Handling
- **Rich Posts**: Create, edit, and delete text posts (up to 500 characters) with up to 10 attached image or video files per post.
- **Media Validation**: Server-side Multer disk storage supporting `jpg`, `jpeg`, `png`, `gif`, `webp`, `mp4`, `webm`, `ogg`, and `mov` up to 50 MB per file.
- **Media Playback**: Responsive media layout with a full-screen `MediaViewer` modal and intersection-based video auto-pause when scrolled out of view.

### Engagement and Notifications
- **Interactions**: Like and unlike posts, add and delete comments (up to 300 characters), and share posts internally with selected users or via shareable links.
- **Notifications**: Event notifications for `follow`, `like`, `comment`, `post`, `share`, and `report_status`, with unread counts polled every 3 seconds and individual or bulk mark-as-read actions.

### Safety, Moderation, and Administration
- **User Blocking**: Bidirectional blocking that prevents interactions and hides content between blocked users.
- **Content Reporting**: Users can report posts or accounts under predefined categories (`spam`, `harassment`, `inappropriate`, `violence`, `hate_speech`, `misinformation`, `other`).
- **Automated Report Expiration**: An hourly server task checks for pending reports older than 7 days, marks them as `dismissed`, and notifies the reporting user.
- **Admin Dashboard**: Role-protected dashboard (`/admin`) with Recharts visualizations for user growth and post activity across preset (`7d`, `30d`, `90d`, `6m`, `1y`) or custom date ranges, user search/filtering, timed or permanent account bans/unbans, post removal, and report resolution.

### Additional Pages and Theme Support
- **Theme Engine**: Dark (default) and Light themes powered by CSS custom properties and persisted in `localStorage`.
- **Support and Legal Pages**: Public landing page (`/welcome`), contact form (`/contact`) with up to 5 file attachments sent via Nodemailer, Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Community Standards (`/standards`).

---

## Tech Stack

### Client
| Package | Version | Role |
|:---|:---|:---|
| React / React DOM | `^19.2.1` | UI rendering and component state |
| Vite | `^7.2.4` | Development server and production bundler |
| React Router DOM | `^6.20.1` | Client-side routing and route guards |
| Axios | `^1.6.2` | HTTP client with auth token and 401 interceptors |
| Recharts | `^3.5.1` | Admin analytics line and bar charts |
| Tailwind CSS | `^4.1.17` | Utility styling with PostCSS and Autoprefixer |

### Server
| Package | Version | Role |
|:---|:---|:---|
| Node.js / Express | `^5.1.0` | HTTP server and REST API routing |
| MongoDB / Mongoose | `^9.0.0` | Document database and schema modeling |
| JSON Web Token (`jsonwebtoken`) | `^9.0.2` | Stateless bearer token authentication |
| Bcrypt | `^6.0.0` | Password hashing |
| Multer | `^2.0.2` | Multipart form-data and media upload handling |
| Nodemailer | `^7.0.11` | SMTP email delivery for password resets and contact form |
| Morgan / CORS / Dotenv | `^1.10.1` / `^2.8.5` / `^17.2.3` | Request logging, CORS, and environment loading |

---

## Project Structure

```text
EchoSocial_Social-Media-Platform/
|-- client/
|   |-- public/
|   |   |-- assets/              # Static images (auth-arch.jpg, auth-cosmic.jpg)
|   |   |-- ES.svg
|   |   `-- Logo.png
|   |-- src/
|   |   |-- components/          # Reusable UI (Navbar, PostCard, CreatePost, MediaViewer, Modal, etc.)
|   |   |-- contexts/            # AuthContext, NotificationContext, ThemeContext
|   |   |-- pages/               # Landing, Home, Profile, People, Notifications, PostView, AdminDashboard, Auth & Policy pages
|   |   |-- services/
|   |   |   `-- api.js           # Axios instance and endpoint wrappers
|   |   |-- utils/
|   |   |   `-- helpers.js       # Client formatting and helper utilities
|   |   |-- App.jsx              # Application routes and providers
|   |   |-- index.css            # Theme tokens and base styles
|   |   `-- main.jsx             # React entry point
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.cjs
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |   `-- database.js      # MongoDB connection setup
|   |   |-- controllers/         # Request handlers (auth, user, post, comment, feed, notification, admin, contact)
|   |   |-- middleware/          # auth, adminAuth, errorHandler, upload (Multer)
|   |   |-- models/              # Mongoose schemas (User, Post, Comment, Notification, Report)
|   |   |-- routes/              # Express route definitions
|   |   |-- utils/               # cronJobs, jwt, sendEmail
|   |   |-- app.js               # Express app configuration, middleware, and route mounting
|   |   `-- server.js            # Server entry point, DB connection, and hourly report job
|   |-- uploads/                 # Local storage directory for uploaded media
|   |-- package.json
|   `-- seed-admin.js            # CLI script to seed the initial admin account
|-- LICENSE
`-- README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas URI)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/hamzaiqbal35/EchoSocial_Social-Media-Platform.git
cd EchoSocial_Social-Media-Platform
```

### 2. Server Setup

```bash
cd server
npm install
```

Ensure the `server/uploads` directory exists (create it if missing) so Multer can write uploaded files.

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echosocial
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Required for password reset emails and contact form submissions
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

Optional: Seed the default administrator account (`admin@echosocial.com` / `admin123`):

```bash
npm run seed:admin
```

Change the seeded admin password after logging in for the first time.

Start the backend server:

```bash
npm run dev
```

The API listens on `http://localhost:5000/api` by default.

### 3. Client Setup

Open a new terminal in `client/`:

```bash
cd client
npm install
```

Optional: Create `client/.env` if you want share links generated with a custom origin instead of `window.location.origin`:

```env
VITE_APP_URL=http://localhost:5173
```

Start the frontend development server:

```bash
npm run dev
```

The client runs on `http://localhost:5173` (note that `client/src/services/api.js` targets `http://localhost:5000/api` by default).

### Available Scripts

| Directory | Command | Description |
|:---|:---|:---|
| `server/` | `npm run dev` | Run server with `nodemon` |
| `server/` | `npm start` | Run server with `node src/server.js` |
| `server/` | `npm run seed:admin` | Create initial admin user if not present |
| `client/` | `npm run dev` | Start Vite development server |
| `client/` | `npm run build` | Build production bundle |
| `client/` | `npm run preview` | Preview production build locally |
| `client/` | `npm run lint` | Run ESLint across client files |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`. Admin routes require an authenticated user with `role: "admin"`.

### Health
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/health` | API health status check | Public |

### Auth (`/api/auth`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | Public |
| `GET` | `/api/auth/me` | Get currently authenticated user | Protected |
| `POST` | `/api/auth/forgotpassword` | Send password reset email token | Public |
| `PUT` | `/api/auth/resetpassword/:resetToken` | Reset password with valid token | Public |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/users/search` | Search users by query | Public |
| `GET` | `/api/users/suggested` | Get suggested users to follow | Protected |
| `GET` | `/api/users/:id` | Get user profile by ID | Public |
| `PUT` | `/api/users/profile` | Update authenticated user profile | Protected |
| `PUT` | `/api/users/password` | Change account password | Protected |
| `DELETE` | `/api/users/account` | Delete authenticated user account | Protected |
| `POST` | `/api/users/:id/follow` | Follow a user | Protected |
| `DELETE` | `/api/users/:id/follow` | Unfollow a user | Protected |
| `GET` | `/api/users/:id/followers` | List user's followers | Public |
| `GET` | `/api/users/:id/following` | List accounts a user follows | Public |
| `POST` | `/api/users/:id/block` | Block a user | Protected |
| `DELETE` | `/api/users/:id/block` | Unblock a user | Protected |
| `POST` | `/api/users/report` | Submit a report against a user or post | Protected |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/posts/search` | Search posts by query | Public |
| `GET` | `/api/posts` | List all posts (paginated) | Public |
| `GET` | `/api/posts/:id` | Get a single post by ID | Public |
| `GET` | `/api/posts/user/:userId` | List posts created by a specific user | Public |
| `POST` | `/api/posts` | Create a post (up to 10 `media` files) | Protected |
| `PUT` | `/api/posts/:id` | Update a post (up to 10 `media` files) | Protected |
| `DELETE` | `/api/posts/:id` | Delete a post | Protected |
| `POST` | `/api/posts/:id/like` | Like a post | Protected |
| `DELETE` | `/api/posts/:id/like` | Remove like from a post | Protected |
| `POST` | `/api/posts/:id/share` | Share a post with specified users | Protected |

### Feed (`/api/feed`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/feed` | Get paginated chronological feed excluding blocked users | Protected |

### Comments (`/api/comments`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/comments/post/:postId` | Get comments for a post | Public |
| `POST` | `/api/comments/post/:postId` | Add a comment to a post | Protected |
| `DELETE` | `/api/comments/:id` | Delete a comment | Protected |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/notifications` | List notifications for current user | Protected |
| `GET` | `/api/notifications/unread-count` | Get unread notification count | Protected |
| `PUT` | `/api/notifications/:id/read` | Mark a single notification as read | Protected |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read | Protected |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/admin/stats` | Platform totals and growth/activity series | Admin |
| `GET` | `/api/admin/users` | List users with pagination, search, and filters | Admin |
| `PUT` | `/api/admin/users/:id/ban` | Ban or suspend a user account | Admin |
| `PUT` | `/api/admin/users/:id/unban` | Restore a banned user account | Admin |
| `GET` | `/api/admin/posts` | List all posts for moderation | Admin |
| `DELETE` | `/api/admin/posts/:id` | Delete any post | Admin |
| `GET` | `/api/admin/reports` | List moderation reports filtered by status | Admin |
| `PUT` | `/api/admin/reports/:id/resolve` | Resolve or dismiss a report | Admin |

### Contact (`/api/contact`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/api/contact` | Submit contact message (up to 5 `media` attachments) | Public |

---

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.

<div align="center">
  <p>Maintained by <strong>Hamza Iqbal</strong></p>
  <p>
    <a href="https://github.com/hamzaiqbal35">GitHub</a> &bull;
    <a href="mailto:hamzaiqbalrajpoot35@gmail.com">Contact</a>
  </p>
</div>

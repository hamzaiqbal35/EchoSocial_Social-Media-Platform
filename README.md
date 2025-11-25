# 🚀 EchoSocial - Modern Social Media Platform

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js) featuring a stunning modern UI with dark mode, glassmorphism effects, and smooth animations.

## ✨ Features

### Core Functionality
- **User Authentication** - Secure registration and login with JWT tokens
- **User Profiles** - Customizable profiles with avatar, bio, and stats
- **Posts** - Create, edit, and delete posts with optional images
- **Comments** - Comment on posts with real-time updates
- **Likes** - Like/unlike posts and see who liked them
- **Follow System** - Follow/unfollow users to curate your feed
- **Personalized Feed** - See posts from users you follow
- **Notifications** - Get notified of follows, likes, and comments
- **Responsive Design** - Mobile-first design that works on all devices

### Technical Features
- **Modern UI/UX** - Dark theme with vibrant gradients and glassmorphism
- **Real-time Updates** - Notification polling for live updates
- **Image Upload** - Base64 image encoding for avatars and posts
- **Pagination** - Efficient loading of posts and feeds
- **Form Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error handling and user feedback
- **Protected Routes** - Secure authentication-required pages

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The `.env` file should contain:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/echosocial
   JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
   NODE_ENV=development
   ```
   - Update `MONGODB_URI` if using MongoDB Atlas
   - Change `JWT_SECRET` to a secure random string in production

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 🚀 Usage

1. **Start MongoDB** - Ensure MongoDB is running locally or you have a connection to MongoDB Atlas

2. **Start the Backend**:
```bash
cd server
npm run dev
```

3. **Start the Frontend** (in a new terminal):
```bash
cd client
npm run dev
```

4. **Open your browser** and navigate to `http://localhost:5173`

5. **Register a new account** or login with existing credentials

## 📱 Features Walkthrough

### Registration & Login
- Create a new account with username, email, and password
- Secure password hashing with bcrypt
- JWT token-based authentication
- Automatic login after registration

### Home Feed
- View posts from users you follow
- Create new posts with text and images
- Like and comment on posts
- Paginated feed with "Load More" functionality

### User Profile
- View your own profile or other users' profiles
- See user stats (posts, followers, following)
- Edit your profile (bio and avatar)
- Follow/unfollow users
- View all posts by a user

### Notifications
- Get notified when someone follows you
- Get notified when someone likes your post
- Get notified when someone comments on your post
- Unread notification count in navbar
- Mark notifications as read

### Posts & Interactions
- Create posts with text (up to 500 characters)
- Upload images with posts
- Like/unlike posts
- Comment on posts
- Delete your own posts and comments
- See who liked your posts

## 🎨 Design System

The application features a modern design system with:
- **Dark Theme** - Easy on the eyes with carefully chosen colors
- **Gradients** - Vibrant gradient accents throughout
- **Glassmorphism** - Frosted glass effects for depth
- **Animations** - Smooth transitions and micro-interactions
- **Typography** - Inter font for clean, modern text
- **Responsive** - Mobile-first design with breakpoints

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes with authentication middleware
- Input validation on client and server
- CORS configured for cross-origin requests

## 📁 Project Structure

```
echosocial/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles & design system
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/:id/follow` - Follow user (protected)
- `DELETE /api/users/:id/follow` - Unfollow user (protected)
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like post (protected)
- `DELETE /api/posts/:id/like` - Unlike post (protected)
- `GET /api/posts/user/:userId` - Get user's posts

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments/post/:postId` - Create comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Feed
- `GET /api/feed` - Get personalized feed (protected, paginated)

### Notifications
- `GET /api/notifications` - Get notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)

## 🚧 Future Enhancements

- [ ] Real-time chat messaging
- [ ] WebSocket integration for live updates
- [ ] Post sharing functionality
- [ ] Hashtag support
- [ ] User mentions (@username)
- [ ] Search functionality
- [ ] Email verification
- [ ] Password reset
- [ ] User blocking
- [ ] Post bookmarking
- [ ] Image optimization and CDN
- [ ] Video post support
- [ ] Stories feature
- [ ] Dark/light theme toggle

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the EchoSocial team

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database
- Express for the robust backend framework

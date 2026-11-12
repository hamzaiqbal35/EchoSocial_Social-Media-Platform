# Server API Documentation

The backend for the ApexcifyTechnologys Social Media Platform is built with Node.js, Express, and MongoDB.

## Tech Stack

- **Node.js**
- **Express 5**
- **MongoDB** & **Mongoose 9**
- **JWT** Authentication
- **Multer** for file uploads

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running locally or Atlas connection string

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file in this directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/echosocial
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

3. Run the server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start`: Runs the server in production mode.
- `npm run dev`: Runs the server in development mode with nodemon.
- `npm run seed:admin`: Seeds the database with an initial admin account.

## API Endpoints Overview

The API is structured around the following resources:

- **/api/auth**: Registration, login, and user identification.
- **/api/users**: User profile management, following, and blocking.
- **/api/posts**: CRUD operations for posts, likes, and feed generation.
- **/api/comments**: Commenting on posts.
- **/api/notifications**: User notifications.
- **/api/admin**: Administrative actions (requires admin role).

For detailed endpoint usage, refer to the route files in `src/routes`.

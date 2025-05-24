# BookReview - Interactive Book Review Platform

BookReview is a full-stack web application that allows users to discover, review, and share their thoughts on books. The platform features an intuitive interface with visually appealing book cards, user authentication, review capabilities, and an admin dashboard for content management.

![BookReview Homepage](Landing%20page.png)

## Live Demo

### Frontend
[BookReview Frontend](https://book-review-platform-9ifh.vercel.app/)

### Backend API
[BookReview API](https://book-review-platform-wnr7.vercel.app/api)

## Screenshots

### Book Listing with Interactive Cards
![Book Listing](Books%20list.png)

### Book Details & Reviews
![Book Details](Review%20page.png)

### My Bookshelf Feature
![My Bookshelf](List-2.png)

### Admin Dashboard
![Admin Dashboard](Admin-Dashboard.png)

## Features

- **Interactive Book Cards**: Visually appealing book cards with animations and hover effects
- **User Authentication**: Register, login, and profile management
- **Reviews & Ratings**: Add, view, and like reviews for books
- **Personal Bookshelf**: Save favorite books to your personal bookshelf
- **Responsive Design**: Fully responsive layout for mobile and desktop
- **Search & Filter**: Find books by title, author, or genre
- **Admin Dashboard**: Manage books, users, and reviews
- **Featured Books**: Highlight special books on homepage
- **Elegant UI**: Modern design with smooth animations using Framer Motion

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (animations)
- React Router
- React Toastify (notifications)
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Frontend (.env)
```
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BookReview.git
   cd BookReview
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory with the provided variables.

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Import sample data (optional)**
   ```bash
   cd ../backend
   npm run data:import
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Default Admin Account
After running the seeder script, a default admin account is created:
- Email: admin@example.com
- Password: password123

## Deployment

### Backend Deployment (Vercel)
1. Create a Vercel account and install Vercel CLI
2. Log in to Vercel from the terminal:
   ```bash
   npm i -g vercel
   vercel login
   ```
3. Deploy the backend:
   ```bash
   cd backend
   vercel
   ```
4. Set up environment variables in the Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NODE_ENV` - Set to "production"
   
5. Configure backend URL in frontend:
   - Update `REACT_APP_API_URL` in `frontend/.env` to match your Vercel deployment URL

### Frontend Deployment (Netlify/Vercel)
1. Update the API URL in `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
   ```
2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy the build folder to Netlify or Vercel:
   - Connect your GitHub repository to Netlify
   - Configure build settings: `npm run build`
   - Set the publish directory to: `frontend/build`

## Project Structure

```
book-review-platform/
├── backend/                  # Backend server
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── .env                  # Environment variables
│   ├── server.js            # Entry point for the backend
│   └── package.json          # Backend dependencies
└── frontend/                 # Frontend client
    ├── public/              # Public assets
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── App.js           # Main app component
    │   ├── index.js         # Entry point for the frontend
    │   └── package.json      # Frontend dependencies
```

## API Documentation

### Backend API URL

The backend API is hosted at:

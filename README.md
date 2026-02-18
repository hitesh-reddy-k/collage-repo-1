# College Platform - Full Stack Application

A comprehensive college management platform with features for posting questions, managing marks, community interactions, and real-time messaging.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based secure authentication with role-based access control
- **Question & Answer System**: Post DSA questions with solutions, levels, and interactive comments
- **Community Pages**: Share posts, like, comment, and interact with other students
- **Marks Management**: Upload and view semester marks (Admin feature)
- **Real-time Messaging**: Socket.IO powered real-time chat between users
- **User Profiles**: Manage profiles with social links (GitHub, Instagram, LinkedIn)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Gmail account for SMTP (or other email service)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd collage-repo-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp backend/env/.env.example backend/env/.env
```

Edit `backend/env/.env` with your values:

```env
# Database
URL="mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRE="7d"

# SMTP Email Configuration
SMTP_SERVICE="gmail"
SMTP_EMAIL="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Node Environment
NODE_ENV="development"

# Port
PORT=3000
```

**Important Security Notes:**
- **NEVER** commit the `.env` file to version control
- Use a strong, unique `JWT_SECRET` in production
- For Gmail SMTP, use [App Passwords](https://support.google.com/accounts/answer/185833)
- Change MongoDB credentials from default values

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📂 Project Structure

```
collage-repo-1/
├── backend/
│   ├── controllers/         # Request handlers
│   ├── databasemodels/      # Mongoose schemas
│   ├── databacesonnect/     # Database connection
│   ├── env/                 # Environment configuration
│   ├── routes/              # API routes
│   ├── socketServer/        # Socket.IO configuration
│   ├── utilities/           # Helper functions (JWT, mailer)
│   ├── index.js             # Main server file
│   └── vercel.json          # Vercel deployment config
├── forentend/               # Frontend HTML/CSS/JS
├── uploads/                 # File uploads directory
├── package.json
└── README.md
```

## 🔐 Security Features Implemented

- ✅ JWT-based authentication with secure cookies
- ✅ Password hashing with bcryptjs
- ✅ Password confirmation validation
- ✅ HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ CORS properly configured for production domains
- ✅ Secure cookie flags (httpOnly, secure in production, sameSite)
- ✅ Environment variables for sensitive data
- ✅ Input validation on critical endpoints
- ✅ MongoDB connection error handling

## 📡 API Endpoints

### Authentication
- `POST /student/register` - Register new user
- `POST /student/login` - Login user
- `GET /student/logout` - Logout user

### User Management
- `GET /student/me` - Get current user
- `GET /student/allusers` - Get all users (Admin only)
- `PUT /student/update/*` - Update user profile fields
- `PUT /student/make-admin/:id` - Promote user to admin (Admin only)

### Questions
- `GET /question` - Get all questions (filter by level)
- `POST /question` - Create new question
- `POST /question/:postId/like` - Like/unlike question
- `POST /question/:postId/comment` - Add comment
- `POST /question/:postId/comment/:commentId/reply` - Reply to comment

### Community
- `GET /community` - Get all community posts
- `POST /community` - Create new post
- `POST /community/:postId/like` - Like/unlike post
- `POST /community/:postId/comment` - Add comment

### Marks
- `GET /marks` - Get user's marks
- `POST /marks/upload` - Upload marks (requires authentication)
- `GET /marks/search` - Search roll numbers

### Messages
- `GET /messages/:id` - Get messages with user
- `POST /messages/send/:id` - Send message to user

## 🚀 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

2. **Set up Vercel project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `backend/vercel.json`

3. **Configure Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `URL` (MongoDB connection string)
     - `JWT_SECRET`
     - `JWT_EXPIRE`
     - `SMTP_SERVICE`
     - `SMTP_EMAIL`
     - `SMTP_PASSWORD`
     - `NODE_ENV` = `production`
     - `PORT` = `3000`

4. **Update Frontend URLs**:
   - Update all API endpoint URLs in frontend files to point to your Vercel backend URL
   - Update `allowedOrigins` in `backend/index.js` if deploying frontend to a different domain

5. **Deploy**:
   ```bash
   vercel --prod
   ```

### Deploying Frontend (if separate)

If deploying frontend separately (e.g., to another Vercel project or Netlify):

1. Update all `fetch()` calls in frontend JS files to use your backend URL
2. Add the frontend domain to `allowedOrigins` in `backend/index.js`
3. Deploy frontend files from the `forentend/` directory

## 🔧 Production Checklist

Before deploying to production:

- [ ] Change all default passwords and secrets
- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Verify MongoDB connection string is correct
- [ ] Test all API endpoints
- [ ] Configure proper SMTP credentials
- [ ] Update CORS allowed origins
- [ ] Set up proper error monitoring
- [ ] Enable rate limiting (consider adding express-rate-limit)
- [ ] Review and remove any debug/console logs
- [ ] Test Socket.IO connections
- [ ] Verify file upload paths work in production
- [ ] Set up database backups
- [ ] Configure SSL/HTTPS (automatic with Vercel)

## 🐛 Troubleshooting

### CORS Errors
- Verify your frontend domain is in the `allowedOrigins` set in `backend/index.js`
- Check Socket.IO CORS configuration in `backend/socketServer/socket.js`

### Authentication Issues
- Ensure `JWT_SECRET` is properly set in environment variables
- Check cookie settings (secure flag requires HTTPS in production)

### Database Connection Issues
- Verify MongoDB connection string in environment variables
- Check MongoDB Atlas IP whitelist (set to 0.0.0.0/0 for Vercel)

### Email Not Sending
- For Gmail, use App Passwords, not your regular password
- Check SMTP credentials are correct
- Verify 2FA is enabled on Gmail if using App Passwords

## 📝 Development Notes

- The backend uses relative paths (`../backend/...`) which work in the current structure
- Images are stored as Buffer data in MongoDB (consider using cloud storage for production)
- Socket.IO uses in-memory storage for user connections (consider Redis for production scaling)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

Hitesh Reddy K

---

**Note**: This project is ready for production deployment. Make sure to follow the security checklist and configure all environment variables properly before going live.

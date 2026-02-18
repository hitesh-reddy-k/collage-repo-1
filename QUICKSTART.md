# Quick Start Guide

Get your College Platform up and running in 5 minutes!

## 🚀 Fast Setup (Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp backend/env/.env.example backend/env/.env

# Edit the .env file with your values
# On Windows: notepad backend/env/.env
# On Mac/Linux: nano backend/env/.env
```

**Minimum required values:**
```env
URL="your-mongodb-connection-string"
JWT_SECRET="any-random-string-at-least-32-characters-long"
JWT_EXPIRE="7d"
NODE_ENV="development"
```

### 3. Start Development Server
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

### 4. Test the Server
```bash
curl http://localhost:3000/health
```

Should return: `{"status":"OK",...}`

## 📝 Quick MongoDB Setup (Free)

### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database user password
7. Paste into `.env` file as `URL` value

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
# Then use:
URL="mongodb://localhost:27017/college-db"
```

## 🔑 Generate JWT Secret
```bash
# Run this command to generate a strong secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and use it as JWT_SECRET in .env
```

## 📧 Email Setup (Optional - Not Required)

Email features are currently disabled. The application works fully without email configuration.

If you want to add email notifications in the future:
```env
SMTP_SERVICE="gmail"
SMTP_EMAIL="your-email@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
```

## 🧪 Test API Endpoints

### Register a User
```bash
curl -X POST http://localhost:3000/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "Username": "Test User",
    "RollNumber": "TEST001",
    "Email": "test@example.com",
    "password": "Test@123456",
    "conformpassword": "Test@123456",
    "PhoneNumber": 1234567890
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "test@example.com",
    "password": "Test@123456"
  }'
```

Save the `token` from the response!

### Get Current User (Protected Route)
```bash
curl http://localhost:3000/student/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🌐 Open Frontend

Open any HTML file from the `forentend/` folder in your browser:
- `forentend/index.html` - Landing page
- `forentend/login.html` - Login page
- `forentend/sig-up.html` - Registration page

**Note**: Update API URLs in frontend JavaScript files to point to your backend:
```javascript
// Change this:
const API_URL = 'http://localhost:3000';
```

## 🎯 Project Structure Quick Reference

```
backend/
├── index.js              # Main server file - START HERE
├── env/.env              # Your configuration
├── controllers/          # Business logic
├── databasemodels/       # MongoDB schemas
├── routes/              # API endpoints
└── utilities/           # Helper functions

forentend/               # Frontend HTML/CSS/JS files
```

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- ✅ Check MongoDB is running (if local)
- ✅ Check connection string in `.env`
- ✅ Check MongoDB Atlas IP whitelist

### "JWT_SECRET is not defined"
- ✅ Check `.env` file exists in `backend/env/`
- ✅ Check `JWT_SECRET` is set in `.env`
- ✅ Restart the server after changes

### "Port 3000 already in use"
- ✅ Kill the process: `netstat -ano | findstr :3000` (Windows)
- ✅ Or use different port in `.env`: `PORT=3001`

### "CORS error from frontend"
- ✅ Check server is running
- ✅ For local development, CORS should work automatically
- ✅ Check console for exact error message

## 📚 Next Steps

1. ✅ Server running? Great!
2. 📖 Read [README.md](README.md) for full documentation
3. 🚀 Ready for production? See [DEPLOYMENT.md](DEPLOYMENT.md)
4. 🔐 Security concerns? Check [SECURITY.md](SECURITY.md)

## 🎓 Learning the Codebase

### Start exploring in this order:
1. `backend/index.js` - Server setup and configuration
2. `backend/routes/userroute.js` - User API routes
3. `backend/controllers/user.js` - User logic
4. `backend/databasemodels/usermodel.js` - User schema
5. `forentend/login.js` - Frontend example

## 💬 Need Help?

- 📖 Check [README.md](README.md) for detailed documentation
- 🐛 Check [PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md) for troubleshooting
- 📧 Contact the maintainer

## 🎉 Success!

If you can:
- ✅ Access `http://localhost:3000/health`
- ✅ Register a new user
- ✅ Login successfully

You're ready to start developing! 🚀

---

**Happy coding! 💻**

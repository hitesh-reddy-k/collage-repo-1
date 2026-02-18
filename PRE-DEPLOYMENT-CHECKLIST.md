# Pre-Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## ⚙️ Environment Configuration

### Backend Environment Variables
- [ ] `backend/env/.env` file exists and is configured
- [ ] `URL` - MongoDB connection string is valid
- [ ] `JWT_SECRET` - Strong secret (minimum 32 characters)
- [ ] `JWT_EXPIRE` - Set to appropriate duration (e.g., "7d")
- [ ] `NODE_ENV` - Set to "production" for production deployment
- [ ] `PORT` - Set to desired port (default: 3000)

### Optional Environment Variables
- [ ] `SMTP_SERVICE` - (Optional) Email service if adding email features
- [ ] `SMTP_EMAIL` - (Optional) Valid email address
- [ ] `SMTP_PASSWORD` - (Optional) Valid app password

### Verify .env is Ignored
- [ ] `.env` files are in `.gitignore`
- [ ] Run: `git check-ignore backend/env/.env` (should return the path)
- [ ] No secrets committed to repository

## 🔐 Security Checks

### Authentication
- [ ] JWT_SECRET is strong and unique (not the default)
- [ ] Password hashing is working (bcryptjs configured)
- [ ] Cookie flags are set correctly (httpOnly, secure, sameSite)

### Database
- [ ] MongoDB connection string does not contain default password
- [ ] Database user has appropriate permissions (not admin)
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0 or specific IPs

### API Security
- [ ] CORS origins are properly configured
- [ ] Security headers are enabled
- [ ] No sensitive data in console logs
- [ ] Error messages don't expose sensitive information

## 🌐 Network Configuration

### CORS Setup
- [ ] `allowedOrigins` in `backend/index.js` includes all production domains
- [ ] Socket.IO CORS in `backend/socketServer/socket.js` matches frontend domains
- [ ] No localhost origins in production build

### URLs
- [ ] Frontend API calls point to production backend URL
- [ ] Backend accepts requests from frontend domain(s)
- [ ] Socket.IO connection URL is correct in frontend

## 📝 Code Quality

### Clean Code
- [ ] No `console.log` statements with sensitive data
- [ ] No commented-out code blocks
- [ ] No TODO comments for critical functionality
- [ ] All imports are used
- [ ] No hardcoded credentials

### Error Handling
- [ ] All async functions have try-catch blocks
- [ ] Error responses are consistent
- [ ] 404 handler is in place
- [ ] Global error handler is configured

## 🧪 Testing

### Local Testing
- [ ] Application starts without errors: `npm start`
- [ ] Health endpoint works: `curl http://localhost:3000/health`
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] JWT authentication works on protected routes
- [ ] File uploads work
- [ ] Socket.IO connections work

### API Endpoint Tests
- [ ] POST `/student/register` - User registration
- [ ] POST `/student/login` - User login
- [ ] GET `/student/logout` - User logout
- [ ] GET `/student/me` - Get current user (protected)
- [ ] POST `/question` - Create question (protected)
- [ ] GET `/question` - Get questions
- [ ] POST `/community` - Create post (protected)
- [ ] GET `/community` - Get posts
- [ ] POST `/marks/upload` - Upload marks (protected)
- [ ] GET `/marks` - Get marks (protected)
- [ ] POST `/messages/send/:id` - Send message (protected)
- [ ] GET `/messages/:id` - Get messages (protected)

## 📦 Dependencies

### Package Management
- [ ] All dependencies installed: `npm install`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Fix fixable vulnerabilities: `npm audit fix`
- [ ] Dependencies are up to date

### Required Packages
- [ ] express
- [ ] mongoose
- [ ] jsonwebtoken
- [ ] bcryptjs
- [ ] dotenv
- [ ] socket.io
- [ ] nodemailer
- [ ] multer
- [ ] cookie-parser
- [ ] cors

## 🚀 Deployment Preparation

### Version Control
- [ ] All changes committed to Git
- [ ] Working on correct branch (main/master)
- [ ] No uncommitted sensitive files
- [ ] `.gitignore` is comprehensive

### Documentation
- [ ] README.md is updated
- [ ] API endpoints are documented
- [ ] Environment variables are documented in .env.example
- [ ] Deployment steps are clear

### Vercel Configuration
- [ ] `vercel.json` is configured correctly
- [ ] Entry point path is correct: `backend/index.js`
- [ ] Build command is appropriate

## 📊 Database Setup

### MongoDB Atlas
- [ ] Cluster is created and running
- [ ] Database user is created
- [ ] User has read/write permissions
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] Connection string is tested and works

### Database Models
- [ ] All models are properly defined
- [ ] Indexes are created where needed
- [ ] Validation rules are in place

## 🔍 Final Checks

### Performance
- [ ] No blocking operations in critical paths
- [ ] Database queries are optimized
- [ ] File uploads use appropriate storage

### Monitoring
- [ ] Health check endpoint responds correctly
- [ ] Logs are clean (no errors on startup)
- [ ] Error handling logs appropriately

### Compliance
- [ ] User data handling is appropriate
- [ ] Password storage is secure
- [ ] No PII in logs

## 📱 Frontend Integration

### API Integration
- [ ] All API endpoints are reachable from frontend
- [ ] Authentication flow works end-to-end
- [ ] File uploads work from frontend
- [ ] Real-time messaging works
- [ ] Error handling on frontend is appropriate

### Production URLs
- [ ] Frontend uses production backend URL
- [ ] No hardcoded localhost URLs
- [ ] Socket.IO connects to production server

## 🎯 Deployment

### Vercel Deployment
- [ ] Logged into Vercel CLI: `vercel login`
- [ ] Project is linked: `vercel link`
- [ ] Environment variables are set in Vercel dashboard
- [ ] Ready to deploy: `vercel --prod`

### Post-Deployment
- [ ] Application is accessible at production URL
- [ ] Health check passes: `curl https://your-app.vercel.app/health`
- [ ] Can register and login
- [ ] All features work in production
- [ ] No errors in Vercel logs

## 📞 Emergency Contacts

### Support Resources
- [ ] Deployment guide accessible: `DEPLOYMENT.md`
- [ ] Security guide accessible: `SECURITY.md`
- [ ] Changelog documented: `CHANGELOG.md`
- [ ] README has troubleshooting section

### Rollback Plan
- [ ] Know how to rollback in Vercel dashboard
- [ ] Previous working deployment is identified
- [ ] Rollback command known: `vercel rollback`

---

## ✅ Sign-Off

Once all items are checked:

- **Reviewed by**: _______________
- **Date**: _______________
- **Environment**: Production / Staging
- **Ready for Deployment**: Yes / No

---

## 🆘 If Something Fails

1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test MongoDB connection
4. Review CORS configuration
5. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section

**Don't panic!** You can always rollback to a previous deployment.

---

**Good luck with your deployment! 🚀**

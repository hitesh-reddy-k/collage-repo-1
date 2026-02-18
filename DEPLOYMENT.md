# Deployment Guide

This guide will help you deploy the College Platform to production.

## 🚀 Quick Deploy to Vercel

### Important Note About Socket.IO
⚠️ **Socket.IO real-time messaging will NOT work on Vercel's serverless platform** due to the stateless nature of serverless functions. If you need real-time messaging, consider:
- Deploying to Heroku, Railway, or DigitalOcean App Platform
- Using a separate WebSocket service (Pusher, Ably)
- Keeping Socket.IO features disabled on Vercel

The application will work fine on Vercel for all other features (questions, community, marks, authentication).

### Step 1: Prepare Your Repository

1. Ensure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. Verify `.gitignore` includes:
   ```
   node_modules/
   .env
   .env.local
   backend/env/.env
   ```

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create/Login to your account
3. Create a new cluster (if you haven't)
4. Go to **Security → Network Access**
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for Vercel
5. Go to **Security → Database Access**
   - Create a database user with strong password
   - Save the credentials securely
6. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### Step 3: Set Up Email Service (Optional)

Email service is currently disabled. If you plan to add email notifications in the future, you can configure:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Save this password (you won't see it again)

**Note**: Current version does not require email service for core functionality.

### Step 4: Deploy Backend to Vercel

1. **Login to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Settings → Environment Variables
   - Add the following variables:

   ```
   URL = mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET = generate-a-strong-random-string-here-min-32-chars
   JWT_EXPIRE = 7d
   NODE_ENV = production
   PORT = 3000
   ```

   **Optional (if adding email features later)**:
   ```
   SMTP_SERVICE = gmail
   SMTP_EMAIL = your-email@gmail.com
   SMTP_PASSWORD = your-gmail-app-password
   ```

   **Important**: 
   - Generate a strong JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Use the Gmail App Password, NOT your regular password

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

5. **Note your backend URL** (e.g., `https://your-project.vercel.app`)

### Step 5: Deploy Frontend (Optional - if separate)

If you want to deploy the frontend separately:

1. Create a new Vercel project for frontend
2. Update all API URLs in frontend JavaScript files:
   ```javascript
   const API_URL = 'https://your-backend.vercel.app';
   ```
3. Deploy frontend:
   ```bash
   cd forentend
   vercel --prod
   ```

### Step 6: Update CORS Settings

1. Edit `backend/index.js`
2. Update `allowedOrigins` with your frontend URLs:
   ```javascript
   const allowedOrigins = new Set([
     "https://your-frontend.vercel.app",
     "https://your-backend.vercel.app",
     // Add all your production domains
   ]);
   ```
3. Edit `backend/socketServer/socket.js`
4. Update Socket.IO CORS origins:
   ```javascript
   origin: [
     "https://your-frontend.vercel.app",
     // Add all your domains
   ]
   ```
5. Commit and redeploy:
   ```bash
   git add .
   git commit -m "Update CORS settings"
   git push
   vercel --prod
   ```

## 🔍 Post-Deployment Verification

### Test Checklist:

- [ ] Visit your backend URL - should show: `{"message":"College API Server","status":"running"}`
- [ ] Test health endpoint: `/health` - should return OK status
- [ ] Try registering a new user
- [ ] Try logging in
- [ ] Create a test post/question
- [ ] Test real-time messaging
- [ ] Check file uploads work
- [ ] Verify CORS - test from frontend domain
- [ ] Check all protected routes require authentication

## 🐛 Common Deployment Issues

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### Issue: "CORS Error"
**Solution**:
- Add your frontend domain to `allowedOrigins`
- Update Socket.IO CORS configuration
- Redeploy after changes

### Issue: "JWT verification failed"
**Solution**:
- Ensure `JWT_SECRET` environment variable is set in Vercel
- Must be the same across all deployments
- Redeploy if you changed it

### Issue: "File uploads not working"
**Solution**:
- Vercel has read-only filesystem except `/tmp`
- File uploads are already configured for `/tmp` in controllers
- For persistent storage, consider AWS S3 or Cloudinary

### Issue: "WebSocket/Socket.IO connection failed"
**Solution**:
- Vercel supports WebSockets
- Ensure Socket.IO CORS is configured correctly
- Check client is connecting to correct URL

## 📊 Monitoring & Logs

### View Logs in Vercel:
1. Go to your project dashboard
2. Click "Deployments"
3. Click on a deployment
4. View "Runtime Logs" and "Build Logs"

### Health Check Monitoring:
- Set up monitoring service (e.g., UptimeRobot, Pingdom)
- Monitor: `https://your-app.vercel.app/health`
- Alert on non-200 responses

## 🔄 Rolling Back a Deployment

If something goes wrong:

1. **Via Vercel Dashboard**:
   - Go to Deployments
   - Find the last working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback
   ```

## 🔐 Security Post-Deployment

After deployment, verify:

1. **Environment Variables**:
   - Never commit `.env` files
   - All secrets are in Vercel Environment Variables
   - JWT_SECRET is strong and unique

2. **Database**:
   - MongoDB user has minimum required permissions
   - Connection string uses SSL (default with Atlas)

3. **API Security**:
   - All sensitive routes require authentication
   - Rate limiting is considered (see next steps)

4. **HTTPS**:
   - Vercel provides automatic HTTPS
   - Verify secure cookies work correctly

## 🚀 Next Steps for Production

Consider implementing:

1. **Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

2. **Logging Service**:
   - Winston or Pino for structured logging
   - Connect to external logging service (Logtail, Papertrail)

3. **Error Tracking**:
   - Sentry for error tracking
   - Get notified of production errors

4. **Database Backups**:
   - Enable automated backups in MongoDB Atlas

5. **CDN for Static Files**:
   - Move images to Cloudinary or AWS S3
   - Use CDN for better performance

6. **Performance Monitoring**:
   - New Relic or DataDog
   - Monitor response times and bottlenecks

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Test locally with production environment variables
4. Check this guide's troubleshooting section

---

**Congratulations! Your application is now deployed to production! 🎉**

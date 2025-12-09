# Quick Start Guide - Cloudflare Access Authentication

This guide will help you get your MERN app with Cloudflare Access authentication up and running quickly.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up MongoDB

Make sure MongoDB is running:
```bash
mongod
```

Or use MongoDB Atlas (cloud database):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

## Step 3: Configure Cloudflare Access

You need two values from Cloudflare:

### A. Get Your Team Domain

1. Go to https://one.dash.cloudflare.com
2. Create a team (e.g., "ishira")
3. Your team domain will be: `ishira.cloudflareaccess.com`

### B. Create an Access Application

1. In Zero Trust dashboard → **Access** → **Applications**
2. Click **Add an application** → **Self-hosted**
3. Configure:
   - **Name**: MERN Auth App
   - **Application domain**: Your app URL (e.g., `https://yourapp.com`)
   - **Session Duration**: 24 hours
4. Add an **Access Policy**:
   - **Name**: Allow My Email
   - **Action**: Allow
   - **Include**: Your email address
5. Click **Save**
6. **Copy the Application Audience (AUD) Tag** from the application settings

### C. Set Up Identity Provider

1. Go to **Settings** → **Authentication**
2. Click **Add new**
3. Choose **One-time PIN** (easiest for testing)
4. Or configure Google, GitHub, etc.

## Step 4: Update Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth
NODE_ENV=development

# Replace with YOUR values from Cloudflare
CLOUDFLARE_TEAM_DOMAIN=ishira.cloudflareaccess.com
CLOUDFLARE_POLICY_AUD=paste-your-aud-tag-here
```

## Step 5: Run the Application

### Start Backend
```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`

## Step 6: Test Locally (Optional)

For local development testing with Cloudflare Access:

### Option A: Cloudflare Tunnel (Recommended)

```bash
# Install cloudflared
# Windows: Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

# Create tunnel
cloudflared tunnel login
cloudflared tunnel create mern-app
cloudflared tunnel route dns mern-app app.yourdomain.com

# Run tunnel
cloudflared tunnel run mern-app
```

### Option B: Deploy to Production

For the fastest path, deploy your app to a production environment:

1. **Frontend**: Deploy to Vercel/Netlify
2. **Backend**: Deploy to Heroku/Railway/DigitalOcean
3. Point your domain to Cloudflare
4. Configure Cloudflare Access for your production domain

## Troubleshooting

### "Not authorized - No Cloudflare Access token found"
- Your app isn't behind Cloudflare Access yet
- For local dev, you need Cloudflare Tunnel or deploy to production

### "Invalid Cloudflare Access token"
- Check `CLOUDFLARE_TEAM_DOMAIN` matches your team domain exactly
- Verify `CLOUDFLARE_POLICY_AUD` is correct from your application settings

### "MongoDB connection error"
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` is correct

### Frontend shows "Authentication failed"
- Backend might not be running
- Check backend logs for errors
- Verify Cloudflare Access is configured correctly

## Next Steps

1. **Read the full setup guide**: [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md)
2. **Customize your app**: Modify the Dashboard page to add your features
3. **Add more routes**: Create new protected routes in your app
4. **Deploy to production**: Follow the deployment guide

## Resources

- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)

## Support

For issues or questions:
- Check the [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md) for detailed instructions
- Review Cloudflare Access logs in your Zero Trust dashboard
- Check backend server logs for authentication errors

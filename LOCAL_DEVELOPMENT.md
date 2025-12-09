# Local Development Guide

This guide explains how to run and test your Cloudflare Access app locally.

## The Problem

When you run your app on `localhost`, **Cloudflare Access is not protecting it**. The `Cf-Access-Jwt-Assertion` header that contains the authentication token is only added by Cloudflare when your app is deployed behind Cloudflare Access.

## The Solution: Development Bypass Mode

We've added a **development bypass mode** that lets you test the app locally without Cloudflare Access.

## Quick Setup (Already Done!)

Your `.env` file is already configured for local development:

```env
NODE_ENV=development
DEV_BYPASS_AUTH=true          # ✅ Bypass Cloudflare Access locally
DEV_USER_EMAIL=test@example.com
DEV_USER_NAME=Test User
```

## How to Run Locally

### 1. Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
⚠️  DEV MODE: Bypassing Cloudflare Access authentication
📧 Using dev user: test@example.com
✅ Created dev user in database
Server running on port 5000
```

### 2. Start Frontend

```bash
cd frontend
npm start
```

### 3. Open Browser

Go to `http://localhost:3000`

You'll see the dashboard with your test user automatically logged in!

## How It Works

When `DEV_BYPASS_AUTH=true` and `NODE_ENV=development`:

1. ✅ Backend **skips** Cloudflare Access JWT validation
2. ✅ Automatically creates a test user (`test@example.com`)
3. ✅ App works exactly like it would in production
4. ✅ No Cloudflare Access setup needed for local testing

## Customize Dev User

Edit `.env` to change the test user:

```env
DEV_USER_EMAIL=myemail@gmail.com
DEV_USER_NAME=My Name
```

Restart the backend, and you'll be logged in as this user.

## Important: Production Deployment

### ⚠️ SECURITY WARNING

**NEVER deploy to production with `DEV_BYPASS_AUTH=true`!**

### For Production:

Update your production `.env`:

```env
NODE_ENV=production
DEV_BYPASS_AUTH=false    # or remove this line entirely
```

When `DEV_BYPASS_AUTH=false` or `NODE_ENV=production`:
- ✅ Full Cloudflare Access JWT validation is enforced
- ✅ Users must authenticate through Cloudflare Access
- ✅ No bypass mode available

## Testing with Real Cloudflare Access

If you want to test with **actual Cloudflare Access** locally:

### Option 1: Cloudflare Tunnel (Recommended)

1. Install cloudflared:
   - Windows: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

2. Create a tunnel:
```bash
cloudflared tunnel login
cloudflared tunnel create mern-app
```

3. Configure your tunnel to point to `localhost:3000` (frontend) and `localhost:5000` (backend)

4. Set `DEV_BYPASS_AUTH=false` in `.env`

5. Run your tunnel and access via the Cloudflare URL

### Option 2: Deploy to Staging

Deploy to a staging environment (Heroku, Railway, etc.) with Cloudflare Access enabled.

## Troubleshooting

### Backend shows "No Cloudflare Access token found"

✅ **Solution**: Make sure `.env` has:
```env
NODE_ENV=development
DEV_BYPASS_AUTH=true
```

Then restart your backend server.

### Frontend shows "Authentication failed"

Check that:
1. ✅ Backend is running on port 5000
2. ✅ MongoDB is connected (check backend logs)
3. ✅ `DEV_BYPASS_AUTH=true` in backend `.env`

### User not created in database

Check MongoDB connection string in `.env`:
```env
MONGODB_URI=mongodb+srv://your-connection-string
```

Make sure MongoDB is accessible.

## Development vs Production Comparison

| Feature | Development (Local) | Production (Deployed) |
|---------|-------------------|----------------------|
| Authentication | Bypassed with test user | Real Cloudflare Access |
| User creation | Auto-created test user | Auto-created from Cloudflare |
| JWT validation | Skipped | Full validation |
| Identity providers | N/A | Google, GitHub, etc. |
| Setup required | None | Cloudflare Access config |

## Next Steps

1. ✅ **Develop locally** with bypass mode enabled
2. ✅ **Test your features** with the test user
3. ✅ **Deploy to production** with `DEV_BYPASS_AUTH=false`
4. ✅ **Configure Cloudflare Access** (see CLOUDFLARE_ACCESS_SETUP.md)
5. ✅ **Test production** with real authentication

## Summary

- **Local development**: `DEV_BYPASS_AUTH=true` → Works instantly
- **Production**: `DEV_BYPASS_AUTH=false` → Full Cloudflare Access security

This gives you the best of both worlds: easy local development and secure production deployment!

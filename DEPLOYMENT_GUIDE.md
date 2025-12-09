# Production Deployment Guide

## Your Setup

- **Frontend**: Vercel at `login.ishira.site`
- **Backend**: Render at `https://mern-login-system-cloudflare.onrender.com`
- **Cloudflare Team**: `ishira.cloudflareaccess.com`
- **AUD Tag**: `40431eeb-0160-4a20-8c7d-f7567e932f0c`

## Step 1: Configure Backend Environment Variables (Render)

Go to your Render dashboard → Your backend service → Environment

Add these environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://ishirapahasara99:admin@cluster0.8itzc65.mongodb.net/login
PORT=5000

# Cloudflare Access Configuration
CLOUDFLARE_TEAM_DOMAIN=ishira.cloudflareaccess.com
CLOUDFLARE_POLICY_AUD=40431eeb-0160-4a20-8c7d-f7567e932f0c

# CORS - Set your Vercel frontend URL
FRONTEND_URL=https://login.ishira.site

# IMPORTANT: Disable dev bypass in production!
DEV_BYPASS_AUTH=false
```

**Save and redeploy** your backend service.

## Step 2: Configure Frontend Environment Variables (Vercel)

Go to Vercel dashboard → Your project → Settings → Environment Variables

Add:

```
REACT_APP_API_URL=https://mern-login-system-cloudflare.onrender.com
```

**Redeploy** your frontend.

## Step 3: Point Your Domain to Cloudflare

### A. Add Domain to Cloudflare

1. Go to https://dash.cloudflare.com
2. Click **Add Site**
3. Enter your domain: `ishira.site`
4. Choose the Free plan
5. Cloudflare will scan your DNS records
6. Update your nameservers at your domain registrar to Cloudflare's nameservers

### B. Configure DNS Records

In Cloudflare DNS settings for `ishira.site`:

**For Frontend (Vercel):**
```
Type: CNAME
Name: login
Target: cname.vercel-dns.com
Proxy status: Proxied (orange cloud)
```

**For Backend (Render):**
```
Type: CNAME
Name: api
Target: mern-login-system-cloudflare.onrender.com
Proxy status: Proxied (orange cloud)
```

**Important**: The orange cloud must be ON (Proxied) for Cloudflare Access to work!

## Step 4: Set Up Cloudflare Access

### A. Go to Zero Trust Dashboard

1. Visit https://one.dash.cloudflare.com
2. Select your team: `ishira`

### B. Configure Identity Provider (if not done)

1. Go to **Settings** → **Authentication**
2. Click **Add new** under Login methods
3. Choose an identity provider:

**Option 1: One-time PIN (Easiest)**
- Select **One-time PIN**
- Users will receive a code via email

**Option 2: Google**
- Select **Google**
- Follow the Google OAuth setup
- Set redirect URI: `https://ishira.cloudflareaccess.com/cdn-cgi/access/callback`

**Option 3: GitHub**
- Select **GitHub**
- Create OAuth app in GitHub settings
- Set callback URL: `https://ishira.cloudflareaccess.com/cdn-cgi/access/callback`

### C. Create Access Application

1. Go to **Access** → **Applications**
2. Click **Add an application**
3. Select **Self-hosted**

**Configure Application:**

**Application name**: `MERN Login System`

**Session Duration**: `24 hours`

**Application domain**: Add BOTH domains:
- `login.ishira.site`
- `api.ishira.site` (or your backend subdomain)

**Application settings:**
- Accept all defaults
- Click **Next**

**Add a Policy:**

**Policy name**: `Allow My Email`

**Action**: `Allow`

**Configure rules** → **Include**:
- Select **Emails**
- Add your email: `ishira.pahasara99@gmail.com`
- (Add more emails if needed)

Click **Next** → **Add application**

### D. Verify Application AUD Tag

1. Click on your newly created application
2. Find the **Application Audience (AUD) Tag**
3. Verify it matches: `40431eeb-0160-4a20-8c7d-f7567e932f0c`

If different, update your Render environment variable `CLOUDFLARE_POLICY_AUD`

## Step 5: Update Backend URL (if using subdomain)

If you want to use `api.ishira.site` instead of the Render URL:

1. Point `api.ishira.site` to your Render backend in Cloudflare DNS
2. Update Vercel environment variable:
   ```
   REACT_APP_API_URL=https://api.ishira.site
   ```
3. Update Render environment variable:
   ```
   FRONTEND_URL=https://login.ishira.site
   ```

## Step 6: SSL/TLS Configuration

In Cloudflare dashboard → SSL/TLS:

1. Set **SSL/TLS encryption mode** to **Full (strict)**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

## Step 7: Test Your Application

### A. Test Backend

Visit: `https://api.ishira.site` (or your Render URL)

You should be redirected to Cloudflare Access login.

### B. Test Frontend

1. Visit: `https://login.ishira.site`
2. You should be redirected to Cloudflare Access
3. Choose your identity provider (Google, GitHub, or One-time PIN)
4. Authenticate
5. You should be redirected back and see the Dashboard with your user info

## Troubleshooting

### "No Cloudflare Access token found"

**Cause**: The domain is not properly protected by Cloudflare Access

**Fix**:
- Ensure DNS proxy is ON (orange cloud)
- Verify the domain is added to your Access application
- Check that you're accessing via the correct domain (not the Render/Vercel default URL)

### "Invalid Cloudflare Access token"

**Cause**: AUD tag mismatch

**Fix**:
- Copy the AUD tag from your Access application
- Update `CLOUDFLARE_POLICY_AUD` in Render
- Redeploy backend

### CORS errors

**Cause**: CORS not configured correctly

**Fix**:
- Set `FRONTEND_URL=https://login.ishira.site` in Render
- Redeploy backend

### Infinite redirect loop

**Cause**: Cloudflare Access policy doesn't include your email

**Fix**:
- Go to Zero Trust → Access → Applications
- Click your application → Edit
- Check policy includes your email
- Try logging out: `https://login.ishira.site/cdn-cgi/access/logout`

### Frontend can't reach backend

**Cause**: Backend URL not set correctly

**Fix**:
- Verify Vercel has `REACT_APP_API_URL` set correctly
- Rebuild frontend in Vercel

## Step 8: Verify Everything Works

### Checklist

- [ ] Backend deployed to Render with correct env vars
- [ ] Frontend deployed to Vercel with correct env vars
- [ ] Domain DNS points to Cloudflare (orange cloud ON)
- [ ] Cloudflare Access application created
- [ ] Both frontend and backend domains added to Access app
- [ ] Your email added to Access policy
- [ ] Identity provider configured (Google/GitHub/OTP)
- [ ] Can access `https://login.ishira.site` and authenticate
- [ ] Dashboard shows your user information
- [ ] Logout works

## Security Notes

### Production Checklist

✅ `DEV_BYPASS_AUTH=false` in Render
✅ `NODE_ENV=production` in Render
✅ Strong MongoDB password
✅ DNS proxied through Cloudflare
✅ SSL/TLS enabled
✅ Access policy restricts to specific emails
✅ Session duration is reasonable (24h)

### Never Commit

Don't commit these to Git:
- `.env` files with real credentials
- MongoDB connection strings
- Cloudflare AUD tags
- Any API keys

## Next Steps

1. ✅ Deploy and configure as above
2. ✅ Test authentication flow
3. ✅ Add more users to Access policy
4. ✅ Customize your Dashboard
5. ✅ Add more features to your app
6. ✅ Monitor Access logs in Cloudflare Zero Trust dashboard

## Support Resources

- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)

## Quick Commands

**Check backend is live:**
```bash
curl https://mern-login-system-cloudflare.onrender.com
```

**Rebuild Vercel:**
- Go to Deployments → Click "..." → Redeploy

**Rebuild Render:**
- Go to your service → Manual Deploy → Deploy latest commit

## Summary

Your app is now:
- ✅ Deployed on Vercel (frontend) and Render (backend)
- ✅ Protected by Cloudflare Access
- ✅ Using your custom domain `login.ishira.site`
- ✅ Authenticating users via Google/GitHub/Email
- ✅ Secure with zero-trust architecture

Users will authenticate once through Cloudflare and have seamless access to your app!

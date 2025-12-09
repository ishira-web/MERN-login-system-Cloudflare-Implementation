# Cloudflare Access Setup Guide

This guide will walk you through setting up Cloudflare Access for authentication with your MERN application.

## What is Cloudflare Access?

Cloudflare Access is a zero-trust security service that authenticates users before they reach your application. It replaces traditional VPNs and provides identity-based access control using various identity providers (Google, GitHub, Azure AD, etc.).

## Prerequisites

1. A Cloudflare account (Free or Paid)
2. A domain managed by Cloudflare
3. Your application deployed and accessible via the internet

## Step 1: Enable Cloudflare Access

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Navigate to **Zero Trust** in the left sidebar
4. If first time, you'll be prompted to create a team name (e.g., `yourcompany`)
5. Your team domain will be: `yourcompany.cloudflareaccess.com`

## Step 2: Configure an Identity Provider

1. In the Zero Trust dashboard, go to **Settings** > **Authentication**
2. Click **Add new** under Login methods
3. Choose an identity provider:
   - **One-time PIN** (Email-based, easiest for testing)
   - **Google**
   - **GitHub**
   - **Azure AD**
   - **Okta**
   - And many more...

### Example: Setting up Google as Identity Provider

1. Select **Google** as the provider
2. You'll need to create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
   - Set authorized redirect URI: `https://yourcompany.cloudflareaccess.com/cdn-cgi/access/callback`
3. Copy the Client ID and Client Secret to Cloudflare
4. Save the configuration

## Step 3: Create an Access Application

1. In Zero Trust dashboard, go to **Access** > **Applications**
2. Click **Add an application**
3. Select **Self-hosted** application
4. Configure the application:

### Application Configuration

**Application Settings:**
- **Application name**: `MERN Auth App`
- **Session Duration**: `24 hours` (or your preference)
- **Application domain**:
  - `https://yourdomain.com` (your frontend)
  - `https://api.yourdomain.com` (your backend API)

**Important**: Add both your frontend and backend domains if they're different.

**Identity Providers:**
- Select the identity providers you configured (e.g., Google, GitHub)

### Access Policy

Create a policy to control who can access your application:

**Policy name**: `Allow Team Members`

**Action**: `Allow`

**Configure rules**:
- Option 1: **Emails** - Whitelist specific email addresses
- Option 2: **Email domains** - Allow entire domains (e.g., `@yourcompany.com`)
- Option 3: **Everyone** - Allow anyone with the identity provider (testing only)

Example for testing:
```
Include:
- Emails: your.email@gmail.com
```

Example for production:
```
Include:
- Email domains ending in: @yourcompany.com
```

4. Click **Save application**

## Step 4: Copy Application Configuration

After creating the application, you need two important values:

1. **Team Domain**: Found in Settings > General
   - Example: `yourcompany.cloudflareaccess.com`

2. **Audience (AUD) Tag**: Found in your application settings
   - Go to **Access** > **Applications** > Click your app
   - Copy the **Application Audience (AUD) Tag**
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

## Step 5: Configure Backend Environment Variables

Update your `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth
NODE_ENV=production

# Cloudflare Access Configuration
CLOUDFLARE_TEAM_DOMAIN=yourcompany.cloudflareaccess.com
CLOUDFLARE_POLICY_AUD=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

Replace `yourcompany` with your actual team name and paste your actual AUD tag.

## Step 6: Deploy Your Application

### Backend Deployment

Your backend must be deployed to a domain protected by Cloudflare Access:

1. Deploy your backend to a hosting service (AWS, Heroku, DigitalOcean, etc.)
2. Point your API subdomain to the backend (e.g., `api.yourdomain.com`)
3. Ensure the domain is proxied through Cloudflare (orange cloud in DNS settings)

### Frontend Deployment

1. Update the frontend to point to your backend API
2. Build the frontend: `npm run build`
3. Deploy to a hosting service (Vercel, Netlify, etc.) or serve from your domain
4. Ensure the domain is protected by Cloudflare Access

## Step 7: Testing

1. Visit your application URL (e.g., `https://yourdomain.com`)
2. You should be redirected to Cloudflare Access login
3. Authenticate with your configured identity provider (Google, GitHub, etc.)
4. After successful authentication, you'll be redirected to your application
5. The application will automatically fetch user info from the backend

## How It Works

```
User Request
    ↓
Cloudflare Edge (Access Check)
    ↓
[Not Authenticated] → Redirect to Login → Identity Provider → Back to App
    ↓
[Authenticated] → Injects JWT Header (Cf-Access-Jwt-Assertion)
    ↓
Backend validates JWT with Cloudflare's public keys
    ↓
User info extracted from JWT
    ↓
User auto-created/retrieved from database
    ↓
Response sent to frontend
```

## Important Headers

When a user is authenticated via Cloudflare Access, these headers are added:

- `Cf-Access-Jwt-Assertion`: The JWT token containing user info
- `Cf-Access-Authenticated-User-Email`: User's email address

The backend validates the JWT using Cloudflare's public JWKS endpoint:
```
https://yourcompany.cloudflareaccess.com/cdn-cgi/access/certs
```

## Security Best Practices

1. **Use HTTPS Only**: Cloudflare Access requires HTTPS
2. **Restrict AUD Tag**: Keep your Application Audience tag secret
3. **Validate JWT**: Always validate the JWT signature with Cloudflare's public keys (already implemented)
4. **Set Appropriate Session Duration**: Don't make it too long (24 hours max recommended)
5. **Use Email Domain Rules**: For production, restrict to your company domain
6. **Enable MFA**: Require multi-factor authentication in your identity provider
7. **Monitor Access Logs**: Use Cloudflare's Access logs to monitor authentication

## Logout

Users can logout by visiting:
```
https://yourdomain.com/cdn-cgi/access/logout
```

This is already implemented in the frontend logout button.

## Troubleshooting

### "Not authorized - No Cloudflare Access token found"

- Ensure your domain is protected by Cloudflare Access
- Check that the Access application includes your API domain
- Verify you're accessing via the correct domain

### "Invalid Cloudflare Access token"

- Check that `CLOUDFLARE_TEAM_DOMAIN` is correct
- Verify `CLOUDFLARE_POLICY_AUD` matches your application's AUD tag
- Ensure the backend can reach `https://[team-domain]/cdn-cgi/access/certs`

### "Server configuration error"

- Ensure environment variables are set correctly
- Restart your backend server after updating `.env`

### User redirected to login repeatedly

- Check Access policy rules - user might not be included
- Verify identity provider is configured correctly
- Check browser cookies are enabled

## Development vs Production

### Development (Local Testing)

For local development, you have two options:

**Option 1: Use Cloudflare Tunnel**
1. Install `cloudflared`: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation
2. Create a tunnel to expose your local app
3. Protect the tunnel URL with Cloudflare Access

**Option 2: Use ngrok or similar**
1. Expose your local app with ngrok: `ngrok http 3000`
2. Add the ngrok URL to Cloudflare Access application
3. Test authentication flow

### Production

In production, ensure:
- Both frontend and backend are on HTTPS
- Domains are properly configured in Cloudflare Access
- Environment variables are set correctly
- CORS is configured to allow your frontend domain

## Additional Resources

- [Cloudflare Access Documentation](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/)
- [Cloudflare Access JWT Validation](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/)
- [Zero Trust Dashboard](https://one.dash.cloudflare.com/)

## Support

If you encounter issues:
1. Check Cloudflare Access logs in the Zero Trust dashboard
2. Review backend server logs for JWT validation errors
3. Verify all configuration values match between Cloudflare and your `.env` file

# MERN Authentication App with Cloudflare Access

A full-stack authentication application built with MongoDB, Express, React, and Node.js (MERN stack). Features **Cloudflare Access integration** for zero-trust authentication using multiple identity providers.

## 🚀 Quick Start

**Want to test locally right now?** → [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) (No Cloudflare setup needed!)

**New to Cloudflare Access?** → [QUICK_START.md](./QUICK_START.md)

**Full deployment guide** → [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md)

## Features

- **Cloudflare Access Integration** - Zero-trust authentication at the edge
- **Multiple Identity Providers** - Google, GitHub, Azure AD, Okta, and more
- **Auto-user provisioning** - Users automatically created on first login
- **JWT Validation** - Backend validates Cloudflare Access JWT tokens
- **Automatic authentication** - No login forms needed, handled by Cloudflare
- **Secure by default** - Authentication happens before reaching your app
- **Clean and responsive UI**
- **RESTful API architecture**

## Tech Stack

**Frontend:**
- React 18
- React Router DOM v6
- Axios
- Context API for state management

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- Cloudflare Access JWT validation
- JWKS-RSA for public key verification

## Project Structure

```
mern-auth-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js (legacy)
│   │   └── cloudflareAuthController.js
│   ├── middleware/
│   │   ├── auth.js (legacy)
│   │   └── cloudflareAuth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth
NODE_ENV=development

# Cloudflare Access Configuration
CLOUDFLARE_TEAM_DOMAIN=your-team-name.cloudflareaccess.com
CLOUDFLARE_POLICY_AUD=your-policy-audience-tag-here
```

**Important**: See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md) for detailed instructions on obtaining these values.

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

**Base URL:** `http://localhost:5000/api/auth`

All routes are protected by Cloudflare Access. The `Cf-Access-Jwt-Assertion` header must be present.

| Method | Endpoint | Description | Cloudflare Access Required |
|--------|----------|-------------|----------------------------|
| GET | `/me` | Get current authenticated user | Yes |
| GET | `/token-info` | Get Cloudflare token information | Yes |

### Request Examples

**Get Current User:**
```
GET /api/auth/me
Headers: {
  "Cf-Access-Jwt-Assertion": "<cloudflare-jwt-token>"
}
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "cloudflareAuth": true,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Get Token Info:**
```
GET /api/auth/token-info
Headers: {
  "Cf-Access-Jwt-Assertion": "<cloudflare-jwt-token>"
}
```

**Note**: In production, these headers are automatically added by Cloudflare Access.

## Usage

1. Start MongoDB (if running locally):
```bash
mongod
```

2. Start the backend server (from the backend directory):
```bash
npm run dev
```

3. Start the frontend (from the frontend directory):
```bash
npm start
```

4. **Configure Cloudflare Access** - See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md)

5. Deploy your application behind Cloudflare Access

6. Visit your application URL and authenticate via Cloudflare Access

**Note**: For local development, you'll need to use Cloudflare Tunnel or ngrok to test the full authentication flow. See the setup guide for details.

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `CLOUDFLARE_TEAM_DOMAIN` - Your Cloudflare team domain (e.g., yourcompany.cloudflareaccess.com)
- `CLOUDFLARE_POLICY_AUD` - Application Audience tag from Cloudflare Access
- `NODE_ENV` - Environment mode (development/production)

## Security Features

- **Zero-trust authentication** - Cloudflare Access authenticates users at the edge
- **JWT validation** - Backend validates Cloudflare Access JWT tokens with public keys
- **Multiple identity providers** - Support for Google, GitHub, Azure AD, Okta, and more
- **Auto-user provisioning** - Users created automatically on first authentication
- **Secure by default** - No passwords stored in database for Cloudflare-authenticated users
- **Environment variables** for sensitive configuration
- **CORS enabled** for cross-origin requests

## Production Deployment

See [CLOUDFLARE_ACCESS_SETUP.md](./CLOUDFLARE_ACCESS_SETUP.md) for complete deployment instructions.

### Backend

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure `CLOUDFLARE_TEAM_DOMAIN` and `CLOUDFLARE_POLICY_AUD` environment variables
4. Deploy behind Cloudflare Access (see setup guide)
5. Enable HTTPS (required by Cloudflare Access)
6. Consider using a process manager like PM2

### Frontend

1. Build the production version:
```bash
npm run build
```

2. Serve the build folder using a static file server or deploy to platforms like:
   - Vercel
   - Netlify
   - Heroku
   - AWS S3 + CloudFront

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const User = require('../models/User');

// Create JWKS client to fetch Cloudflare's public keys
const getJwksClient = (teamDomain) => {
  return jwksClient({
    jwksUri: `https://${teamDomain}/cdn-cgi/access/certs`,
    cache: true,
    cacheMaxAge: 86400000, // 24 hours
  });
};

// Get signing key from JWKS
const getKey = (client) => {
  return (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };
};

// Middleware to protect routes with Cloudflare Access
const cloudflareAccessProtect = async (req, res, next) => {
  try {
    // DEVELOPMENT MODE: Bypass Cloudflare Access for local testing
    if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true') {
      const devEmail = process.env.DEV_USER_EMAIL || 'dev@example.com';
      const devName = process.env.DEV_USER_NAME || 'Dev User';

      console.log('⚠️  DEV MODE: Bypassing Cloudflare Access authentication');
      console.log(`📧 Using dev user: ${devEmail}`);

      // Find or create dev user
      let user = await User.findOne({ email: devEmail });

      if (!user) {
        user = await User.create({
          name: devName,
          email: devEmail,
          password: Math.random().toString(36).slice(-8),
          cloudflareAuth: true,
        });
        console.log('✅ Created dev user in database');
      }

      req.user = user;
      req.cloudflareToken = { email: devEmail, name: devName, iat: Date.now() };
      return next();
    }

    // PRODUCTION MODE: Validate Cloudflare Access token
    // Get the JWT token from Cloudflare Access header
    const token = req.headers['cf-access-jwt-assertion'];

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized - No Cloudflare Access token found. For local development, set DEV_BYPASS_AUTH=true in .env',
      });
    }

    const teamDomain = process.env.CLOUDFLARE_TEAM_DOMAIN;
    const policyAud = process.env.CLOUDFLARE_POLICY_AUD;

    if (!teamDomain || !policyAud) {
      return res.status(500).json({
        message: 'Server configuration error - Cloudflare Access not configured',
      });
    }

    // Create JWKS client for this request
    const client = getJwksClient(teamDomain);

    // Verify the JWT token
    jwt.verify(
      token,
      getKey(client),
      {
        audience: policyAud,
        issuer: `https://${teamDomain}`,
        algorithms: ['RS256'],
      },
      async (err, decoded) => {
        if (err) {
          console.error('Cloudflare Access JWT verification failed:', err.message);
          return res.status(401).json({
            message: 'Not authorized - Invalid Cloudflare Access token',
          });
        }

        // Extract user information from the token
        const email = decoded.email;
        const name = decoded.name || email.split('@')[0];

        if (!email) {
          return res.status(401).json({
            message: 'Not authorized - No email in token',
          });
        }

        // Find or create user in database
        let user = await User.findOne({ email });

        if (!user) {
          // Auto-create user from Cloudflare Access
          user = await User.create({
            name: name,
            email: email,
            password: Math.random().toString(36).slice(-8), // Random password (won't be used)
            cloudflareAuth: true,
          });
        }

        // Attach user to request
        req.user = user;
        req.cloudflareToken = decoded;

        next();
      }
    );
  } catch (error) {
    console.error('Cloudflare Access middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = { cloudflareAccessProtect };

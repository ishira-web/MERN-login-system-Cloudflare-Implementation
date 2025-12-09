const express = require('express');
const router = express.Router();
const {
  getCurrentUser,
  getTokenInfo,
} = require('../controllers/cloudflareAuthController');
const { cloudflareAccessProtect } = require('../middleware/cloudflareAuth');

// All routes are protected by Cloudflare Access
router.get('/me', cloudflareAccessProtect, getCurrentUser);
router.get('/token-info', cloudflareAccessProtect, getTokenInfo);

module.exports = router;

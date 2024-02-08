const { success, warning } = require("../services/chalk");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('149909023249-chnggqc1ekl5829ebnlsqorma48p8l9f.apps.googleusercontent.com')

// Middleware to check authentication
const checkauthentication = async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.headers.authorization,
      audience: '149909023249-chnggqc1ekl5829ebnlsqorma48p8l9f.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    req.user = payload; // Add user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to check admin authentication
const checkAdminAuthentication = (req, res, next) => {
  if (req.user && req.user.isadmin) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// Middleware to check super admin authentication
const checkSuperAdminAuthentication = (req, res, next) => {
  if (req.user && req.user.issuperadmin) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = { checkauthentication, checkAdminAuthentication,checkSuperAdminAuthentication };

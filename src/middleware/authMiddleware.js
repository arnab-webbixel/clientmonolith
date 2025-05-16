// middleware/auth.js
const axios = require('axios');

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    // Try staff token validation first
    let user;
    try {
      const staffRes = await axios.post(
        'http://localhost:3008/api/v1/validate-token',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const s = staffRes.data.user;
      user = {
        id: s.staffId,
        name: s.staffName,
        email: s.email,
        role: 'staff'
      };
    } catch (e) {
      // If staff token fails, try admin
      const adminRes = await axios.post(
        'http://localhost:3002/api/v1/validate-token',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const a = adminRes.data.data.data;
      user = {
        id: a.userId,
        name: null, // optional if not in token
        email: a.email,
        role: 'admin'
      };
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

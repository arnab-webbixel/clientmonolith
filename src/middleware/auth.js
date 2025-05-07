const axios = require('axios');

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const { data } = await axios.post(
      'http://localhost:3008/api/v1/validate-token',
      {},
      { headers: { authorization: `Bearer ${token}` } }
    );
    // { data.user: { staffId, staffName, role, email, user_id } }
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
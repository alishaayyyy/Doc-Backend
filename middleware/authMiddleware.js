const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Debug log: Check karein ke header aa raha hai ya nahi
  const authHeader = req.header('Authorization');
  console.log("Received Auth Header:", authHeader); 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token or wrong format, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Secret Key check
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ msg: 'Server Configuration Error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 3. Debug log: Ye batayega ke token expired hai ya signature galat hai
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
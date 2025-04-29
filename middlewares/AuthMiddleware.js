const { verify } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Thiếu token truy cập" });

  try {
    const validToken = verify(token, JWT_SECRET);
    req.user = validToken;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token không hợp lệ" });
  }
};

module.exports = { validateToken };
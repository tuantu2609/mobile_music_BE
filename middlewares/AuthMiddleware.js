const { verify } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, JWT_SECRET);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(403).json({ error: "Invalid Token!" });
  }
};

module.exports = { validateToken };

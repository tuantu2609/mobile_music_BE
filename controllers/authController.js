const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const USERS = require("../users");
const SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Email not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
};

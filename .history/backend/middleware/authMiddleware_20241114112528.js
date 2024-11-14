const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");
  try {
    req.user = jwt.verify(token, "your_jwt_secret_key");
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};
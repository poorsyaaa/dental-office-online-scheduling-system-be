const jwt = require("jsonwebtoken");

const generateTokens = (userId, username) => {
  const accessToken = jwt.sign({ id: userId, username }, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });
  const refreshToken = jwt.sign({ id: userId, username }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "2d" });
  return { accessToken, refreshToken };
};

const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

module.exports = {
  generateTokens,
  refreshTokenExpiry,
};

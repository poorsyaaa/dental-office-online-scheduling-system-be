const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.apiError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
      switch (err.name) {
        case "TokenExpiredError":
          return res.apiError({ message: "Access Token Expired", statusCode: 403 });
        case "JsonWebTokenError":
        case "NotBeforeError":
          return res.apiError({ message: "Invalid Access Token", statusCode: 403 });
        default:
          return res.apiError({ message: "Token Verification Failed", statusCode: 403 });
      }
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

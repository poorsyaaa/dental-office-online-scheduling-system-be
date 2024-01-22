const rateLimit = require("express-rate-limit");

/* eslint-disable @typescript-eslint/no-unused-vars */
const keyGenerator = (request, _response) => {
  if (!request.ip) {
    console.error("Warning: request.ip is missing!");
    return request.socket.remoteAddress;
  }
  return request.ip.replace(/:\d+[^:]*$/, "");
};

const limiter = rateLimit({
  windowMs: 100, // 100 seconds
  max: 1000, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "You can't make any more requests at the moment. Try again later",
  keyGenerator: keyGenerator,
});

module.exports = limiter;

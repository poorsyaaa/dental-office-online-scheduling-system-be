// src/middlewares/errorHandler.js
const errorHandler = (err, _, res, __) => {
  console.error(err.stack);

  return res.apiError({
    error: err.message,
    message: "Internal Server Error",
    statusCode: 500,
  });
};

module.exports = errorHandler;

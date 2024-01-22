const apiResponseHandler = (_, res, next) => {
  res.apiResponse = ({ data = null, message = "Success", statusCode = 200 }) => {
    res.status(statusCode).json({ status: "success", message, data });
  };

  res.apiError = ({ error = null, message = "Error", statusCode = 500 }) => {
    res.status(statusCode).json({ status: "error", message, error });
  };

  next();
};

module.exports = apiResponseHandler;

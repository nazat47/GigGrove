export const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    statusCode: err.statusCode || 500
  };
  if (err.code === 11000) {
    customError.msg = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    customError.statusCode = 400
  }
  if (err.name === "ValidationError") {
    customError.msg = err.message;
    customError.statusCode = 400
  }
  if (err.name === "CastError") {
    customError.msg = "Nothing found with this id";
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ errMsg: customError.msg });
};

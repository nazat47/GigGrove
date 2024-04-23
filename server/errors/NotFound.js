import CustomError from "./CustomError.js";

class NotFound extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
export default NotFound;

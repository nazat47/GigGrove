import CustomError from "./CustomError.js";

class Unauthorized extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
export default Unauthorized;

import CustomError from "./CustomError.js";

class Unauthenticated extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
export default Unauthenticated;

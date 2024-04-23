import BadRequest from "../errors/BadRequest.js";
import Unauthorized from "../errors/Unauthorized.js";
import { verifyToken } from "../utils/createToken.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]
  if (!token) {
    throw new BadRequest("Token not found");
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Unauthorized("Token not valid");
  }
  req.userId = decoded.userId;
  next();
};

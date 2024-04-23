import jwt from "jsonwebtoken";

export const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
